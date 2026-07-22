"use client";

import React, { useEffect, useState } from "react";
import { Modal, Loader } from "@mantine/core";
import { IconTrash, IconPlus, IconCheck } from "@tabler/icons-react";
import { GetAllInstituteBatches } from "@/axios/batch/BatchGetApi";
import {
  AddTeacherToBatch,
  RemoveTeacherFromBatch,
} from "@/axios/teacher/TeacherPutApi";

interface Batch {
  _id: string;
  name: string;
}

interface Props {
  opened: boolean;
  onClose: () => void;
  teacherId: string;
  instituteId: string;
  // Batches already assigned to this teacher
  assignedBatches: Batch[];
  // Called after any change so parent can refresh teacher data
  onUpdate: () => void;
}

export default function ManageTeacherBatchesModal({
  opened,
  onClose,
  teacherId,
  instituteId,
  assignedBatches,
  onUpdate,
}: Props) {
  const [allBatches, setAllBatches] = useState<Batch[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  // Fetch all institute batches when modal opens
  useEffect(() => {
    if (!opened || !instituteId) return;
    setLoadingBatches(true);
    (GetAllInstituteBatches(instituteId) as Promise<any>)
      .then((res: any) => {
        setAllBatches(res?.data || res?.batches || []);
      })
      .catch(() => setAllBatches([]))
      .finally(() => setLoadingBatches(false));
  }, [opened, instituteId]);

  const assignedIds = new Set(assignedBatches.map((b) => b._id));

  const handleAdd = async (batchId: string) => {
    setActionLoadingId(batchId);
    try {
      await AddTeacherToBatch(teacherId, batchId);
      setSuccessId(batchId);
      setTimeout(() => setSuccessId(null), 1500);
      onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRemove = async (batchId: string) => {
    setActionLoadingId(batchId);
    try {
      await RemoveTeacherFromBatch(teacherId, batchId);
      onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <span style={{ fontWeight: 700, fontSize: 17, color: "#0A0F2C" }}>
          Manage Batches
        </span>
      }
      size="md"
      radius={16}
      overlayProps={{ backgroundOpacity: 0.4, blur: 3 }}
      styles={{
        header: { background: "#F8F9FD", borderBottom: "1px solid #E8EAF0" },
        body: { padding: 0 },
      }}
    >
      {/* ── Currently Assigned ── */}
      <div style={{ padding: "20px 24px 0" }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: "#8A92A6",
          letterSpacing: 1.2, marginBottom: 12,
        }}>
          CURRENTLY ASSIGNED ({assignedBatches.length})
        </div>

        {assignedBatches.length === 0 ? (
          <div style={{
            textAlign: "center", color: "#8A92A6", fontSize: 13,
            padding: "16px 0", background: "#F8F9FD",
            borderRadius: 10, marginBottom: 8,
          }}>
            No batches assigned yet
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
            {assignedBatches.map((batch) => (
              <div
                key={batch._id}
                style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between",
                  background: "linear-gradient(135deg, #0A0F2C, #1A2456)",
                  borderRadius: 10, padding: "10px 14px",
                }}
              >
                <span style={{ color: "#F5C842", fontWeight: 600, fontSize: 14 }}>
                  {batch.name}
                </span>
                <button
                  disabled={actionLoadingId === batch._id}
                  onClick={() => handleRemove(batch._id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    background: "rgba(239,68,68,0.15)",
                    border: "1px solid rgba(239,68,68,0.35)",
                    borderRadius: 8, padding: "5px 12px",
                    color: "#FCA5A5", fontSize: 12, fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {actionLoadingId === batch._id ? (
                    <Loader size={12} color="red" />
                  ) : (
                    <IconTrash size={13} />
                  )}
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ height: 1, background: "#E8EAF0", margin: "20px 0" }} />

      {/* ── Available Batches ── */}
      <div style={{ padding: "0 24px 24px" }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: "#8A92A6",
          letterSpacing: 1.2, marginBottom: 12,
        }}>
          ADD FROM INSTITUTE BATCHES
        </div>

        {loadingBatches ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
            <Loader size="sm" color="#0A0F2C" />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 260, overflowY: "auto" }}>
            {allBatches
              .filter((b) => !assignedIds.has(b._id))
              .map((batch) => (
                <div
                  key={batch._id}
                  style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                    background: "#F8F9FD",
                    border: "1px solid #E8EAF0",
                    borderRadius: 10, padding: "10px 14px",
                  }}
                >
                  <span style={{ color: "#0A0F2C", fontWeight: 600, fontSize: 14 }}>
                    {batch.name}
                  </span>
                  <button
                    disabled={actionLoadingId === batch._id}
                    onClick={() => handleAdd(batch._id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      background: successId === batch._id
                        ? "rgba(34,197,94,0.15)"
                        : "rgba(10,15,44,0.08)",
                      border: successId === batch._id
                        ? "1px solid rgba(34,197,94,0.35)"
                        : "1px solid rgba(10,15,44,0.15)",
                      borderRadius: 8, padding: "5px 12px",
                      color: successId === batch._id ? "#22C55E" : "#0A0F2C",
                      fontSize: 12, fontWeight: 600, cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {actionLoadingId === batch._id ? (
                      <Loader size={12} color="#0A0F2C" />
                    ) : successId === batch._id ? (
                      <IconCheck size={13} />
                    ) : (
                      <IconPlus size={13} />
                    )}
                    {successId === batch._id ? "Added!" : "Assign"}
                  </button>
                </div>
              ))}

            {/* All batches already assigned */}
            {allBatches.filter((b) => !assignedIds.has(b._id)).length === 0 &&
              !loadingBatches && (
                <div style={{
                  textAlign: "center", color: "#8A92A6", fontSize: 13,
                  padding: "16px 0", background: "#F8F9FD", borderRadius: 10,
                }}>
                  All institute batches are already assigned ✅
                </div>
              )}
          </div>
        )}
      </div>
    </Modal>
  );
}