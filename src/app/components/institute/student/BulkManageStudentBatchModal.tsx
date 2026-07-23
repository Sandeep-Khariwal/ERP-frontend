"use client";

import {
  Button,
  Flex,
  LoadingOverlay,
  Modal,
  Radio,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { BatchOption } from "./InstituteStudentsPage";
import {
  AssignStudentBatchMultiple,
  UnassignStudentBatchMultiple,
} from "@/axios/student/StudentPut";
import {
  ErrorNotification,
  SuccessNotification,
} from "@/app/helperFunction/Notification";

/* ─────────────────────────────────────────
   Reuses the same custom confirm dialog look
   as ManageStudentBatchesModal for consistency.
───────────────────────────────────────── */

type DialogType = "assign" | "remove";

interface ConfirmOptions {
  type: DialogType;
  title: string;
  body: string;
  confirmText: string;
  onConfirm: () => void;
}

const dialogStyles = `
  .bccd-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.22s ease;
    pointer-events: none;
  }
  .bccd-overlay.bccd-show {
    opacity: 1;
    pointer-events: all;
  }
  .bccd-box {
    background: #fff;
    border-radius: 16px;
    padding: 28px 28px 22px;
    width: 420px;
    max-width: 92vw;
    box-shadow: 0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08);
    transform: scale(0.93) translateY(10px);
    opacity: 0;
    transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1),
                opacity 0.22s ease;
  }
  .bccd-overlay.bccd-show .bccd-box {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  .bccd-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    font-size: 22px;
  }
  .bccd-icon-warn   { background: #FFF3CD; color: #856404; }
  .bccd-icon-danger { background: #FDECEA; color: #C62828; }
  .bccd-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 8px;
  }
  .bccd-body {
    font-size: 14px;
    color: #555;
    line-height: 1.65;
    margin-bottom: 24px;
  }
  .bccd-body .bccd-tag {
    display: inline;
    background: #E8F4FD;
    color: #1565C0;
    border-radius: 5px;
    padding: 1px 7px;
    font-size: 13px;
    font-weight: 500;
  }
  .bccd-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
  .bccd-btn {
    padding: 8px 18px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid #ddd;
    background: #f5f5f5;
    color: #333;
    transition: background 0.15s, transform 0.1s;
  }
  .bccd-btn:hover { background: #ebebeb; }
  .bccd-btn:active { transform: scale(0.97); }
  .bccd-btn-primary {
    background: #5E35B1;
    border-color: transparent;
    color: #fff;
  }
  .bccd-btn-primary:hover { background: #4527A0; }
  .bccd-btn-danger {
    background: #C62828;
    border-color: transparent;
    color: #fff;
  }
  .bccd-btn-danger:hover { background: #B71C1C; }
`;

function BulkConfirmDialog({
  options,
  onClose,
}: {
  options: ConfirmOptions | null;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const prevOptions = useRef<ConfirmOptions | null>(null);

  useEffect(() => {
    if (options) {
      prevOptions.current = options;
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [options]);

  const displayed = options ?? prevOptions.current;
  if (!displayed) return null;

  const iconCls = displayed.type === "assign" ? "bccd-icon-warn" : "bccd-icon-danger";
  const symbol = displayed.type === "assign" ? "⇄" : "−";
  const confirmCls =
    displayed.type === "assign" ? "bccd-btn bccd-btn-primary" : "bccd-btn bccd-btn-danger";

  return (
    <>
      <style>{dialogStyles}</style>
      <div
        className={`bccd-overlay${visible ? " bccd-show" : ""}`}
        onClick={(e) => {
          if ((e.target as HTMLElement).classList.contains("bccd-overlay")) onClose();
        }}
      >
        <div className="bccd-box">
          <div className={`bccd-icon ${iconCls}`}>{symbol}</div>
          <div className="bccd-title">{displayed.title}</div>
          <div className="bccd-body" dangerouslySetInnerHTML={{ __html: displayed.body }} />
          <div className="bccd-actions">
            <button className="bccd-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              className={confirmCls}
              onClick={() => {
                displayed.onConfirm();
                onClose();
              }}
            >
              {displayed.confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   Main Bulk Modal
   Reuses AssignStudentBatchMultiple / UnassignStudentBatchMultiple,
   which on the backend loop through assignStudentToBatch /
   removeStudentFromBatchNew per student — so every existing
   validation + per-student history entry still applies.
───────────────────────────────────────── */

export const BulkManageStudentBatchModal = (props: {
  opened: boolean;
  selectedStudentIds: string[];
  allBatches: BatchOption[];
  onClose: () => void;
  onCompleted: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [confirmOpts, setConfirmOpts] = useState<ConfirmOptions | null>(null);

  const selectedBatch = props.allBatches.find((b) => b.id === selectedBatchId);
  const count = props.selectedStudentIds.length;

  const handleAssign = () => {
    if (!selectedBatch) {
      ErrorNotification("Please select a batch first");
      return;
    }

    setConfirmOpts({
      type: "assign",
      title: "Bulk assign batch",
      body: `Assign <span class="bccd-tag">${selectedBatch.name}</span> to <b>${count}</b> selected student(s)? Any batch they're currently in will be automatically removed.`,
      confirmText: "Yes, assign",
      onConfirm: () => {
        setIsLoading(true);
        AssignStudentBatchMultiple(
          props.selectedStudentIds,
          selectedBatch.id,
          selectedBatch.name,
        )
          .then((res: any) => {
            SuccessNotification(res?.message || "Batch assigned to selected students");
            setIsLoading(false);
            setSelectedBatchId("");
            props.onCompleted();
            props.onClose();
          })
          .catch((e) => {
            console.log(e);
            setIsLoading(false);
            ErrorNotification(
              e?.response?.data?.message || "Failed to bulk-assign batch",
            );
          });
      },
    });
  };

  const handleRemove = () => {
    if (!selectedBatch) {
      ErrorNotification("Please select a batch first");
      return;
    }

    setConfirmOpts({
      type: "remove",
      title: "Bulk remove from batch",
      body: `Remove <span class="bccd-tag">${selectedBatch.name}</span> from <b>${count}</b> selected student(s)?`,
      confirmText: "Remove",
      onConfirm: () => {
        setIsLoading(true);
        UnassignStudentBatchMultiple(
          props.selectedStudentIds,
          selectedBatch.id,
          selectedBatch.name,
        )
          .then((res: any) => {
            SuccessNotification(res?.message || "Batch removed from selected students");
            setIsLoading(false);
            setSelectedBatchId("");
            props.onCompleted();
            props.onClose();
          })
          .catch((e) => {
            console.log(e);
            setIsLoading(false);
            ErrorNotification(
              e?.response?.data?.message || "Failed to bulk-remove batch",
            );
          });
      },
    });
  };

  return (
    <>
      <BulkConfirmDialog options={confirmOpts} onClose={() => setConfirmOpts(null)} />

      <Modal
        opened={props.opened}
        onClose={props.onClose}
        title={
          <Text fz={18} fw={700}>
            Bulk Manage Batch — {count} student{count !== 1 ? "s" : ""} selected
          </Text>
        }
        size={480}
        centered
      >
        <LoadingOverlay visible={isLoading} />
        <Stack>
          <Text fz={13} c="dimmed">
            Choose a batch, then assign it to or remove it from all selected
            students. Each student's individual history is preserved.
          </Text>

          <Radio.Group
            value={selectedBatchId}
            onChange={setSelectedBatchId}
            label="Select Batch"
          >
            <Stack mt={8}>
              {props.allBatches.map((batch) => (
                <Radio key={batch.id} value={batch.id} label={batch.name} />
              ))}
            </Stack>
          </Radio.Group>

          <Flex gap={10} mt={10} justify="flex-end">
            <Button
              variant="light"
              color="red"
              radius="xl"
              onClick={handleRemove}
              disabled={!selectedBatchId}
            >
              Remove From Batch
            </Button>
            <Button radius="xl" onClick={handleAssign} disabled={!selectedBatchId}>
              Assign Batch
            </Button>
          </Flex>
        </Stack>
      </Modal>
    </>
  );
};
