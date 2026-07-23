"use client";

import {
  Badge,
  Button,
  Flex,
  LoadingOverlay,
  Modal,
  Stack,
  Tabs,
  Text,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { StudentListItem, BatchOption } from "./InstituteStudentsPage";
import {
  AssignStudentBatch,
  UnassignStudentBatch,
} from "@/axios/student/StudentPut";
import { GetStudentBatchHistory } from "@/axios/student/StudentGetApi";
import {
  ErrorNotification,
  SuccessNotification,
} from "@/app/helperFunction/Notification";

/* ─────────────────────────────────────────
   Custom Confirm Dialog
───────────────────────────────────────── */

type DialogType = "assign" | "remove" | "info";

interface ConfirmOptions {
  type: DialogType;
  title: string;
  body: string; // supports HTML
  confirmText: string;
  onConfirm: () => void;
}

const dialogStyles = `
  .ccd-overlay {
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
  .ccd-overlay.ccd-show {
    opacity: 1;
    pointer-events: all;
  }
  .ccd-box {
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
  .ccd-overlay.ccd-show .ccd-box {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  .ccd-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    font-size: 22px;
  }
  .ccd-icon-warn  { background: #FFF3CD; color: #856404; }
  .ccd-icon-danger { background: #FDECEA; color: #C62828; }
  .ccd-icon-info  { background: #E8F4FD; color: #1565C0; }
  .ccd-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 8px;
  }
  .ccd-body {
    font-size: 14px;
    color: #555;
    line-height: 1.65;
    margin-bottom: 24px;
  }
  .ccd-body .ccd-tag {
    display: inline;
    background: #E8F4FD;
    color: #1565C0;
    border-radius: 5px;
    padding: 1px 7px;
    font-size: 13px;
    font-weight: 500;
  }
  .ccd-body .ccd-tag-red {
    background: #FDECEA;
    color: #C62828;
  }
  .ccd-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
  .ccd-btn {
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
  .ccd-btn:hover { background: #ebebeb; }
  .ccd-btn:active { transform: scale(0.97); }
  .ccd-btn-primary {
    background: #5E35B1;
    border-color: transparent;
    color: #fff;
  }
  .ccd-btn-primary:hover { background: #4527A0; }
  .ccd-btn-danger {
    background: #C62828;
    border-color: transparent;
    color: #fff;
  }
  .ccd-btn-danger:hover { background: #B71C1C; }
`;

function ConfirmDialog({
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
      // slight delay so CSS transition fires after mount
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [options]);

  const displayed = options ?? prevOptions.current;
  if (!displayed) return null;

  const iconMap: Record<DialogType, { cls: string; symbol: string }> = {
    assign: { cls: "ccd-icon-warn",   symbol: "⇄" },
    remove: { cls: "ccd-icon-danger", symbol: "−" },
    info:   { cls: "ccd-icon-info",   symbol: "i" },
  };
  const confirmCls: Record<DialogType, string> = {
    assign: "ccd-btn ccd-btn-primary",
    remove: "ccd-btn ccd-btn-danger",
    info:   "ccd-btn ccd-btn-primary",
  };

  const { cls, symbol } = iconMap[displayed.type];

  return (
    <>
      <style>{dialogStyles}</style>
      <div
        className={`ccd-overlay${visible ? " ccd-show" : ""}`}
        onClick={(e) => {
          if ((e.target as HTMLElement).classList.contains("ccd-overlay")) onClose();
        }}
      >
        <div className="ccd-box">
          <div className={`ccd-icon ${cls}`}>{symbol}</div>
          <div className="ccd-title">{displayed.title}</div>
          <div
            className="ccd-body"
            dangerouslySetInnerHTML={{ __html: displayed.body }}
          />
          <div className="ccd-actions">
            <button className="ccd-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              className={confirmCls[displayed.type]}
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
   Types
───────────────────────────────────────── */

interface HistoryEntry {
  batchId: string;
  batchName: string;
  action: "ASSIGNED" | "REMOVED";
  date: string;
}

/* ─────────────────────────────────────────
   Main Modal
───────────────────────────────────────── */

export const ManageStudentBatchesModal = (props: {
  opened: boolean;
  student: StudentListItem;
  allBatches: BatchOption[];
  onClose: () => void;
  onUpdated: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [assignedBatchId, setAssignedBatchId] = useState<string>("");
  const [confirmOpts, setConfirmOpts] = useState<ConfirmOptions | null>(null);

  const getAssignedId = () => {
    if (props.student.batchIds && props.student.batchIds.length > 0) {
      return props.student.batchIds[0]._id;
    }
    if (props.student.batchId && typeof props.student.batchId === "object") {
      return (props.student.batchId as any)._id;
    }
    return "";
  };

  useEffect(() => {
    setAssignedBatchId(getAssignedId());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.student]);

  const fetchHistory = () => {
    setIsLoading(true);
    GetStudentBatchHistory(props.student._id)
      .then((res: any) => {
        setHistory(res.history || []);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (props.opened) fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.opened]);

  /* ── Assign ── */
  const handleAssign = (batchId: string, batchName: string) => {
    const current = props.allBatches.find((b) => b.id === assignedBatchId);

    setConfirmOpts({
      type: current ? "assign" : "info",
      title: current ? "Assign new batch" : "Assign batch",
      body: current
        ? `Assign <span class="ccd-tag">${batchName}</span> to this student? Their current batch <span class="ccd-tag ccd-tag-red">${current.name}</span> will be automatically removed.`
        : `Assign <span class="ccd-tag">${batchName}</span> to this student?`,
      confirmText: "Yes, assign",
      onConfirm: () => {
        setIsLoading(true);
        AssignStudentBatch(props.student._id, batchId, batchName)
          .then(() => {
            SuccessNotification("Batch assigned successfully");
            setAssignedBatchId(batchId);
            fetchHistory();
            props.onUpdated();
            setIsLoading(false);
          })
          .catch((e) => {
            console.log(e);
            setIsLoading(false);
            ErrorNotification(
              e?.response?.data?.message || "Failed to assign batch"
            );
          });
      },
    });
  };

  /* ── Remove ── */
  const handleRemove = (batchId: string, batchName: string) => {
    setConfirmOpts({
      type: "remove",
      title: "Remove from batch",
      body: `Remove this student from <span class="ccd-tag ccd-tag-red">${batchName}</span>? They won't be enrolled in any batch after this.`,
      confirmText: "Remove",
      onConfirm: () => {
        setIsLoading(true);
        UnassignStudentBatch(props.student._id, batchId, batchName)
          .then(() => {
            SuccessNotification("Batch removed successfully");
            setAssignedBatchId("");
            fetchHistory();
            props.onUpdated();
            setIsLoading(false);
          })
          .catch((e) => {
            console.log(e);
            setIsLoading(false);
            ErrorNotification(
              e?.response?.data?.message || "Failed to remove batch"
            );
          });
      },
    });
  };

  const currentBatch = props.allBatches.find((b) => b.id === assignedBatchId);
  const availableBatches = props.allBatches.filter(
    (b) => b.id !== assignedBatchId
  );

  return (
    <>
      {/* Custom confirm dialog — renders outside Mantine Modal so z-index is correct */}
      <ConfirmDialog
        options={confirmOpts}
        onClose={() => setConfirmOpts(null)}
      />

      <Modal
        opened={props.opened}
        onClose={props.onClose}
        title={
          <Text fz={18} fw={700}>
            Manage Batch — {props.student.name}
          </Text>
        }
        size={520}
        centered
      >
        <LoadingOverlay visible={isLoading} />
        <Tabs defaultValue="batches">
          <Tabs.List>
            <Tabs.Tab value="batches">Batch Management</Tabs.Tab>
            <Tabs.Tab value="history">Assignment History</Tabs.Tab>
          </Tabs.List>

          {/* ── Batch tab ── */}
          <Tabs.Panel value="batches" pt={20}>
            <Stack>
              <Text fz={14} fw={700} c={"#5E35B1"}>
                Currently Assigned
              </Text>

              {!currentBatch && (
                <Text fz={13} c={"dimmed"}>
                  No batch assigned yet.
                </Text>
              )}

              {currentBatch && (
                <Flex
                  key={currentBatch.id}
                  justify="space-between"
                  align="center"
                  p={10}
                  style={{ border: "1px solid #ECECEC", borderRadius: 12 }}
                >
                  <Text fz={14} fw={600}>
                    {currentBatch.name}
                  </Text>
                  <Button
                    size="xs"
                    color="red"
                    variant="light"
                    radius="xl"
                    onClick={() =>
                      handleRemove(currentBatch.id, currentBatch.name)
                    }
                  >
                    Remove
                  </Button>
                </Flex>
              )}

              <Text fz={14} fw={700} c={"#5E35B1"} mt={10}>
                Available Batches
              </Text>

              {availableBatches.length === 0 && (
                <Text fz={13} c={"dimmed"}>
                  No more batches to assign.
                </Text>
              )}

              {availableBatches.map((batch) => (
                <Flex
                  key={batch.id}
                  justify="space-between"
                  align="center"
                  p={10}
                  style={{ border: "1px solid #ECECEC", borderRadius: 12 }}
                >
                  <Text fz={14} fw={600}>
                    {batch.name}
                  </Text>
                  <Button
                    size="xs"
                    variant="light"
                    radius="xl"
                    onClick={() => handleAssign(batch.id, batch.name)}
                  >
                    Assign
                  </Button>
                </Flex>
              ))}
            </Stack>
          </Tabs.Panel>

          {/* ── History tab ── */}
          <Tabs.Panel value="history" pt={20}>
            <Stack>
              {history.length === 0 && (
                <Text fz={13} c={"dimmed"}>
                  No history yet.
                </Text>
              )}
              {[...history]
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((entry, idx) => (
                  <Flex
                    key={idx}
                    justify="space-between"
                    align="center"
                    p={10}
                    style={{ border: "1px solid #ECECEC", borderRadius: 12 }}
                  >
                    <Flex direction="column">
                      <Text fz={14} fw={600}>
                        {entry.batchName}
                      </Text>
                      <Text fz={12} c={"dimmed"}>
                        {new Date(entry.date).toLocaleString()}
                      </Text>
                    </Flex>
                    <Badge
                      color={entry.action === "ASSIGNED" ? "green" : "red"}
                      variant="light"
                    >
                      {entry.action === "ASSIGNED" ? "Assigned" : "Removed"}
                    </Badge>
                  </Flex>
                ))}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Modal>
    </>
  );
};