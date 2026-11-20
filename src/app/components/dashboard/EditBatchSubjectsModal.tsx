"use client";

import React, { useEffect, useState } from "react";
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  AlertCircle,
  Info,
  Search,
  Sparkles,
} from "lucide-react";
import { GetAllSubjectsFromBatch } from "@/axios/batch/BatchGetApi";
import { UpdateBatchSubjects } from "@/axios/batch/BatchPutApi";
import { GetInstituteSubjects } from "@/axios/institute/InstituteGetApi";
import {
  SuccessNotification,
  ErrorNotification,
} from "@/app/helperFunction/Notification";

export type SubjectType = "scholastic" | "co-scholastic";

export interface BatchSubjectItem {
  _id?: string;
  name: string;
  type: SubjectType;
  isOptional: boolean;
  teachers?: string[];
  isNew?: boolean;
}

export interface EditBatchSubjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchId: string;
  batchName: string;
  onSuccess?: (updatedSubjects: any[]) => void;
}

export function EditBatchSubjectsModal({
  isOpen,
  onClose,
  batchId,
  batchName,
  onSuccess,
}: EditBatchSubjectsModalProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // State
  const [assignedSubjects, setAssignedSubjects] = useState<BatchSubjectItem[]>([]);
  const [masterSubjects, setMasterSubjects] = useState<
    { _id: string; value: string; label: string; type: SubjectType }[]
  >([]);
  const [selectedMasterId, setSelectedMasterId] = useState<string | null>(null);

  // New custom subject state
  const [showAddNewInput, setShowAddNewInput] = useState<boolean>(false);
  const [customSubjectName, setCustomSubjectName] = useState<string>("");
  const [customSubjectType, setCustomSubjectType] = useState<SubjectType>("scholastic");
  const [customIsOptional, setCustomIsOptional] = useState<boolean>(false);

  // Editing state for an individual subject row
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>("");

  // UI state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Fetch data on open
  useEffect(() => {
    if (!isOpen || !batchId) return;

    let isMounted = true;
    setIsLoading(true);
    setHasChanges(false);
    setShowAddNewInput(false);
    setCustomSubjectName("");
    setSelectedMasterId(null);
    setEditingIndex(null);
    setSearchQuery("");

    Promise.all([
      GetAllSubjectsFromBatch(batchId).catch((err) => {
        console.error("Error fetching batch subjects:", err);
        return null;
      }),
      GetInstituteSubjects().catch((err) => {
        console.error("Error fetching institute subjects:", err);
        return null;
      }),
    ])
      .then(([batchRes, masterRes]: any[]) => {
        if (!isMounted) return;

        // Process batch subjects
        const rawBatchList = batchRes?.subjects?.subjects || [];
        const rawOptionalList = batchRes?.subjects?.optionalSubjects || [];

        const merged: BatchSubjectItem[] = [
          ...rawBatchList.map((s: any) => ({
            _id: s._id,
            name: s.name || s.label || s.value || "",
            type: (s.type === "co-scholastic" ? "co-scholastic" : "scholastic") as SubjectType,
            isOptional: false,
            teachers: s.teachers || [],
          })),
          ...rawOptionalList.map((s: any) => ({
            _id: s._id,
            name: s.name || s.label || s.value || "",
            type: (s.type === "co-scholastic" ? "co-scholastic" : "scholastic") as SubjectType,
            isOptional: true,
            teachers: s.teachers || [],
          })),
        ];

        setAssignedSubjects(merged);

        // Process master catalog subjects
        const rawMaster = masterRes?.subjects || masterRes?.data?.subjects || [];
        setMasterSubjects(
          rawMaster.map((m: any) => ({
            _id: m._id,
            value: m.value || m.label,
            label: m.label || m.value,
            type: (m.type === "co-scholastic" ? "co-scholastic" : "scholastic") as SubjectType,
          }))
        );

        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to load subject data", err);
        ErrorNotification("Failed to load subjects for this batch");
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, batchId]);

  // Handle adding an existing master subject
  const handleAddMasterSubject = () => {
    if (!selectedMasterId) return;

    const master = masterSubjects.find((m) => m._id === selectedMasterId);
    if (!master) return;

    // Check duplicate
    const exists = assignedSubjects.some(
      (s) => s.name.trim().toLowerCase() === master.label.trim().toLowerCase()
    );
    if (exists) {
      ErrorNotification(`"${master.label}" is already assigned to this batch`);
      return;
    }

    const newItem: BatchSubjectItem = {
      name: master.label,
      type: master.type || "scholastic",
      isOptional: false,
      teachers: [],
      isNew: true,
    };

    setAssignedSubjects((prev) => [...prev, newItem]);
    setSelectedMasterId(null);
    setHasChanges(true);
  };

  // Handle adding a brand new custom subject
  const handleAddCustomSubject = () => {
    const trimmed = customSubjectName.trim();
    if (!trimmed) {
      ErrorNotification("Please enter a valid subject name");
      return;
    }

    // Check duplicate in current batch
    const exists = assignedSubjects.some(
      (s) => s.name.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      ErrorNotification(`"${trimmed}" is already assigned to this batch`);
      return;
    }

    const newItem: BatchSubjectItem = {
      name: trimmed,
      type: customSubjectType,
      isOptional: customIsOptional,
      teachers: [],
      isNew: true,
    };

    setAssignedSubjects((prev) => [...prev, newItem]);
    setCustomSubjectName("");
    setCustomSubjectType("scholastic");
    setCustomIsOptional(false);
    setShowAddNewInput(false);
    setHasChanges(true);
  };

  // Handle removing a subject from the batch
  const handleRemoveSubject = (index: number) => {
    setAssignedSubjects((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
    }
    setHasChanges(true);
  };

  // Toggle subject type (scholastic vs co-scholastic)
  const handleToggleType = (index: number) => {
    setAssignedSubjects((prev) =>
      prev.map((sub, i) =>
        i === index
          ? {
              ...sub,
              type: sub.type === "scholastic" ? "co-scholastic" : "scholastic",
            }
          : sub
      )
    );
    setHasChanges(true);
  };

  // Toggle optional vs compulsory
  const handleToggleOptional = (index: number) => {
    setAssignedSubjects((prev) =>
      prev.map((sub, i) =>
        i === index
          ? {
              ...sub,
              isOptional: !sub.isOptional,
            }
          : sub
      )
    );
    setHasChanges(true);
  };

  // Save inline name edit
  const handleSaveInlineEdit = (index: number) => {
    const trimmed = editingName.trim();
    if (!trimmed) {
      ErrorNotification("Subject name cannot be empty");
      return;
    }

    // Check if another subject in batch has this name
    const duplicate = assignedSubjects.some(
      (s, i) => i !== index && s.name.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      ErrorNotification(`Another subject named "${trimmed}" already exists in this batch`);
      return;
    }

    setAssignedSubjects((prev) =>
      prev.map((sub, i) => (i === index ? { ...sub, name: trimmed } : sub))
    );
    setEditingIndex(null);
    setEditingName("");
    setHasChanges(true);
  };

  // Save all changes to the server
  const handleSaveChanges = async () => {
    if (!batchId) return;

    setIsSaving(true);
    try {
      const payload = {
        subjects: assignedSubjects.map((s) => ({
          _id: s._id && !s._id.startsWith("temp-") ? s._id : undefined,
          name: s.name.trim(),
          type: s.type,
          isOptional: s.isOptional,
        })),
      };

      const response: any = await UpdateBatchSubjects(batchId, payload);

      if (response && (response.status === 200 || response.data || response.subjects)) {
        SuccessNotification(`Subjects updated successfully for ${batchName}!`);
        setHasChanges(false);

        const updatedList =
          response.subjects?.subjects || response.data?.subjects || assignedSubjects;

        if (onSuccess) {
          onSuccess(updatedList);
        }

        onClose();
      } else {
        ErrorNotification(response?.message || "Failed to update batch subjects");
      }
    } catch (error: any) {
      console.error("Save batch subjects error:", error);
      ErrorNotification(
        error?.response?.data?.message || error?.message || "Error updating batch subjects"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Filter master subjects to exclude those already assigned
  const availableMasterOptions = masterSubjects
    .filter(
      (m) =>
        !assignedSubjects.some(
          (assigned) =>
            assigned.name.trim().toLowerCase() === m.label.trim().toLowerCase()
        )
    )
    .map((m) => ({
      value: m._id,
      label: `${m.label} (${m.type === "co-scholastic" ? "Co-Scholastic" : "Scholastic"})`,
    }));

  // Filtered assigned subjects based on search query
  const filteredAssignedSubjects = assignedSubjects.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <Modal
      opened={isOpen}
      onClose={() => {
        if (!isSaving) onClose();
      }}
      size={isMobile ? "100%" : 720}
      radius={18}
      padding={24}
      centered
      title={
        <Flex align="center" gap={12}>
          <Box
            style={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              background: "#EEF3FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BookOpen size={22} color="#2F6FED" />
          </Box>
          <Box>
            <Text fz={18} fw={700} c="#1B2559">
              Manage Batch Subjects
            </Text>
            <Text fz={13} fw={500} c="#8B96AD">
              Batch: <span style={{ color: "#2F6FED", fontWeight: 600 }}>{batchName}</span>
            </Text>
          </Box>
        </Flex>
      }
      styles={{
        header: {
          borderBottom: "1px solid #F1F4F9",
          paddingBottom: 16,
          marginBottom: 16,
        },
      }}
    >
      <Box pos="relative">
        <LoadingOverlay visible={isLoading || isSaving} overlayProps={{ blur: 1 }} />

        <Stack gap={18}>
          {/* Informational banner */}
          <Alert
            icon={<Info size={16} />}
            color="blue"
            variant="light"
            radius="md"
            styles={{ message: { fontSize: 13, lineHeight: 1.4 } }}
          >
            Manage the subjects taught in this batch. Removing a subject unassigns it from this
            batch without affecting institute master records or historical student marks.
          </Alert>

          {/* 🔹 Add Subject Section */}
          <Paper
            p={16}
            radius="md"
            withBorder
            style={{ backgroundColor: "#FAFBFD", borderColor: "#EAF0F9" }}
          >
            <Text fz={14} fw={600} c="#1B2559" mb={10}>
              Assign Subjects to Batch
            </Text>

            {!showAddNewInput ? (
              <Flex gap={10} direction={isMobile ? "column" : "row"} align="flex-end">
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Select
                    label="Select from Institute Catalog"
                    placeholder="Choose an existing subject..."
                    data={availableMasterOptions}
                    value={selectedMasterId}
                    onChange={(val) => setSelectedMasterId(val)}
                    searchable
                    clearable
                    nothingFoundMessage="No unassigned master subjects found"
                    styles={{
                      input: { borderRadius: 10 },
                    }}
                  />
                </Box>
                <Group gap={8} wrap="nowrap">
                  <Button
                    leftSection={<Plus size={16} />}
                    onClick={handleAddMasterSubject}
                    disabled={!selectedMasterId}
                    style={{
                      background: selectedMasterId ? "#2F6FED" : undefined,
                      borderRadius: 10,
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="light"
                    color="gray"
                    leftSection={<Sparkles size={16} />}
                    onClick={() => setShowAddNewInput(true)}
                    style={{ borderRadius: 10 }}
                  >
                    Create New
                  </Button>
                </Group>
              </Flex>
            ) : (
              /* Inline form to create and assign a brand new subject */
              <Box>
                <Flex gap={10} direction={isMobile ? "column" : "row"} align="flex-end">
                  <TextInput
                    label="New Subject Name"
                    placeholder="e.g. Environmental Studies"
                    value={customSubjectName}
                    onChange={(e) => setCustomSubjectName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddCustomSubject();
                    }}
                    required
                    style={{ flex: 1 }}
                    styles={{ input: { borderRadius: 10 } }}
                  />
                  <Select
                    label="Type"
                    value={customSubjectType}
                    onChange={(val) => setCustomSubjectType((val as SubjectType) || "scholastic")}
                    data={[
                      { value: "scholastic", label: "Scholastic" },
                      { value: "co-scholastic", label: "Co-Scholastic" },
                    ]}
                    w={isMobile ? "100%" : 150}
                    allowDeselect={false}
                    styles={{ input: { borderRadius: 10 } }}
                  />
                  <Group gap={8} wrap="nowrap">
                    <Button
                      onClick={handleAddCustomSubject}
                      style={{ background: "#2F6FED", borderRadius: 10 }}
                    >
                      Add to Batch
                    </Button>
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      size="lg"
                      onClick={() => {
                        setShowAddNewInput(false);
                        setCustomSubjectName("");
                      }}
                      title="Cancel custom subject"
                    >
                      <X size={18} />
                    </ActionIcon>
                  </Group>
                </Flex>
                <Group mt={10}>
                  <Switch
                    label="Mark as Optional Subject"
                    size="sm"
                    checked={customIsOptional}
                    onChange={(e) => setCustomIsOptional(e.currentTarget.checked)}
                  />
                </Group>
              </Box>
            )}
          </Paper>

          {/* 🔹 Assigned Subjects Header & Search */}
          <Flex justify="space-between" align="center" wrap="wrap" gap={10}>
            <Flex align="center" gap={8}>
              <Text fz={15} fw={700} c="#1B2559">
                Currently Assigned Subjects
              </Text>
              <Badge variant="filled" color="blue" size="md" radius="sm">
                {assignedSubjects.length}
              </Badge>
            </Flex>

            {assignedSubjects.length > 4 && (
              <TextInput
                placeholder="Search subjects..."
                leftSection={<Search size={14} color="#8B96AD" />}
                size="xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                styles={{ input: { borderRadius: 8 } }}
                w={isMobile ? "100%" : 180}
              />
            )}
          </Flex>

          <Divider color="#F1F4F9" />

          {/* 🔹 Subject List */}
          <ScrollArea.Autosize mah={320} scrollbarSize={6} offsetScrollbars>
            {filteredAssignedSubjects.length === 0 ? (
              <Box py={30} style={{ textAlign: "center" }}>
                <BookOpen size={36} color="#C4CBDD" style={{ margin: "0 auto 8px" }} />
                <Text fz={14} fw={600} c="#8B96AD">
                  {assignedSubjects.length === 0
                    ? "No subjects assigned to this batch yet."
                    : "No subjects matching your search."}
                </Text>
                <Text fz={12} c="#A0ABC0" mt={4}>
                  Use the selector above to assign subjects.
                </Text>
              </Box>
            ) : (
              <Stack gap={10}>
                {filteredAssignedSubjects.map((sub, displayIdx) => {
                  const realIndex = assignedSubjects.findIndex((item) => item === sub);
                  const isEditingThis = editingIndex === realIndex;

                  return (
                    <Paper
                      key={`${sub.name}-${realIndex}`}
                      p={12}
                      radius="md"
                      withBorder
                      style={{
                        borderColor: sub.isNew ? "#BFDBFE" : "#F1F4F9",
                        backgroundColor: sub.isNew ? "#F8FAFF" : "#FFFFFF",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <Flex
                        justify="space-between"
                        align="center"
                        wrap="wrap"
                        gap={10}
                      >
                        {/* Left: Name and inline editing */}
                        <Box style={{ flex: 1, minWidth: isMobile ? "100%" : 180 }}>
                          {isEditingThis ? (
                            <Flex align="center" gap={6}>
                              <TextInput
                                size="xs"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveInlineEdit(realIndex);
                                  if (e.key === "Escape") setEditingIndex(null);
                                }}
                                autoFocus
                                styles={{ input: { borderRadius: 6 } }}
                                style={{ flex: 1 }}
                              />
                              <ActionIcon
                                size="sm"
                                color="green"
                                variant="light"
                                onClick={() => handleSaveInlineEdit(realIndex)}
                                title="Save name"
                              >
                                <Check size={14} />
                              </ActionIcon>
                              <ActionIcon
                                size="sm"
                                color="gray"
                                variant="subtle"
                                onClick={() => setEditingIndex(null)}
                                title="Cancel"
                              >
                                <X size={14} />
                              </ActionIcon>
                            </Flex>
                          ) : (
                            <Flex align="center" gap={8}>
                              <Text fw={600} fz={14} c="#1B2559">
                                {sub.name}
                              </Text>
                              {sub.isNew && (
                                <Badge size="xs" color="indigo" variant="light">
                                  New
                                </Badge>
                              )}
                              <Tooltip label="Edit subject name" withArrow position="top">
                                <ActionIcon
                                  size="xs"
                                  variant="subtle"
                                  color="gray"
                                  onClick={() => {
                                    setEditingIndex(realIndex);
                                    setEditingName(sub.name);
                                  }}
                                >
                                  <Edit3 size={13} />
                                </ActionIcon>
                              </Tooltip>
                            </Flex>
                          )}

                          {/* Future teacher assignment foundation preview */}
                          <Text fz={11} c="#8B96AD" mt={2}>
                            {sub.teachers && sub.teachers.length > 0
                              ? `${sub.teachers.length} teacher(s) linked`
                              : "No teachers assigned yet"}
                          </Text>
                        </Box>

                        {/* Middle: Badges / Quick Toggles */}
                        <Group gap={8} wrap="nowrap">
                          {/* Scholastic / Co-Scholastic toggle badge */}
                          <Tooltip
                            label="Click to toggle Scholastic / Co-Scholastic"
                            withArrow
                            position="top"
                          >
                            <Badge
                              variant="light"
                              color={sub.type === "co-scholastic" ? "orange" : "blue"}
                              size="sm"
                              radius="sm"
                              style={{ cursor: "pointer", userSelect: "none" }}
                              onClick={() => handleToggleType(realIndex)}
                            >
                              {sub.type === "co-scholastic" ? "Co-Scholastic" : "Scholastic"}
                            </Badge>
                          </Tooltip>

                          {/* Compulsory vs Optional badge */}
                          <Tooltip
                            label="Click to toggle Compulsory / Optional"
                            withArrow
                            position="top"
                          >
                            <Badge
                              variant="outline"
                              color={sub.isOptional ? "purple" : "gray"}
                              size="sm"
                              radius="sm"
                              style={{ cursor: "pointer", userSelect: "none" }}
                              onClick={() => handleToggleOptional(realIndex)}
                            >
                              {sub.isOptional ? "Optional" : "Compulsory"}
                            </Badge>
                          </Tooltip>
                        </Group>

                        {/* Right: Remove button */}
                        <Tooltip label="Remove from this batch" withArrow position="left">
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            size="md"
                            radius="md"
                            onClick={() => handleRemoveSubject(realIndex)}
                          >
                            <Trash2 size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Flex>
                    </Paper>
                  );
                })}
              </Stack>
            )}
          </ScrollArea.Autosize>

          <Divider color="#F1F4F9" mt={6} />

          {/* 🔹 Footer Actions */}
          <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
            <Text fz={12} c="#8B96AD">
              {hasChanges ? "⚠️ You have unsaved changes" : "All changes saved"}
            </Text>

            <Group gap={12}>
              <Button
                variant="default"
                onClick={onClose}
                disabled={isSaving}
                style={{ borderRadius: 10 }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveChanges}
                loading={isSaving}
                disabled={isLoading || (!hasChanges && assignedSubjects.length === 0)}
                style={{
                  background: "#2F6FED",
                  borderRadius: 10,
                }}
              >
                Save Changes
              </Button>
            </Group>
          </Flex>
        </Stack>
      </Box>
    </Modal>
  );
}
