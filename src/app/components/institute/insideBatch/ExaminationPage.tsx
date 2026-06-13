"use client";

import { useState, useCallback, useEffect } from "react";

import {
    Box,
    Button,
    TextInput,
    Text,
    Title,
    Group,
    Stack,
    Drawer,
    Paper,
    Pagination,
    ThemeIcon,
    Flex,
    FileInput,
    Grid,
    Loader,
} from "@mantine/core";

import { useMediaQuery, useDisclosure } from "@mantine/hooks";

import { Modal, Menu, ActionIcon } from "@mantine/core";

import {
    IconPlus,
    IconBook,
    IconCheck,
    IconX,
    IconUpload,
    IconSparkles,
    IconDotsVertical,
    IconTrash,
} from "@tabler/icons-react";

import { DeleteExamination } from "@/axios/institute/InstituteDeleteApi";

import { notifications } from "@mantine/notifications";

import { CreateExamination } from "@/axios/institute/InstitutePostApi";
import { GetExamination } from "@/axios/institute/InstituteGetApi";
import { UploadExamination } from "@/axios/institute/InstitutePutApi";
import { SuccessNotification } from "@/app/helperFunction/Notification";

// ───────────────── TYPES ─────────────────

interface ExaminationItem {
    _id: string;
    title: string;
    url: string;
}

interface EntryFormProps {
    onCancel: () => void;
    batchId: string;
    fetchNotes: () => void;
    isLoading?: boolean;
    setIsLoading?: (v: boolean) => void;
}

// ───────────────── FORM ─────────────────

function EntryForm({
    onCancel,
    batchId,
    fetchNotes,
    isLoading,
    setIsLoading,
}: EntryFormProps) {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleSave = async () => {
        if (!title || !file) {
            notifications.show({
                title: "Validation Error",
                message: "Please fill all required fields",
                color: "red",
                icon: <IconX size={16} />,
            });

            return;
        }

        try {
            setIsLoading?.(true);

            const formData = new FormData();

            formData.append("examination", file);

            // STEP 1 → Upload
            const uploadRes: any = await UploadExamination(formData);

            console.log("UPLOAD RES :", uploadRes);

            const uploadedUrl =
                uploadRes?.url ||
                uploadRes?.data?.url ||
                uploadRes?.response?.url;
            await CreateExamination({
                batchId,
                title,
                url: uploadedUrl,
            });

            SuccessNotification("Examination Added!");

            fetchNotes();

            onCancel();

            setTitle("");
            setFile(null);
        } catch (e) {
            console.log(e);

            notifications.show({
                title: "Upload Failed",
                message:
                    "Unable to upload study material right now. Please try again.",
                color: "red",
                icon: <IconX size={16} />,
            });
        } finally {
            setIsLoading?.(false);
        }
    };

    return (
        <Stack gap="lg">
            <TextInput
                label="Examination Title"
                placeholder="Enter examination title"
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
                radius="xl"
                size="md"
                styles={{
                    input: {
                        border: "1px solid #e5dbff",
                        background: "#faf7ff",
                    },
                }}
            />

            <FileInput
                label="Examination File"
                placeholder="Choose file"
                value={file}
                onChange={setFile}
                radius="xl"
                size="md"
                leftSection={<IconUpload size={18} />}
                styles={{
                    input: {
                        border: "1px solid #e5dbff",
                        background: "#faf7ff",
                    },
                }}
            />

            <Group justify="flex-end" mt="md">
                <Button
                    variant="default"
                    radius="xl"
                    onClick={onCancel}
                >
                    Cancel
                </Button>

                <Button
                    radius="xl"
                    loading={isLoading}
                    disabled={isLoading}
                    onClick={handleSave}
                    leftSection={<IconCheck size={18} />}
                    style={{
                        background:
                            "linear-gradient(135deg, #5c3de8, #7b5ef8)",
                    }}
                >
                    Create Examination
                </Button>
            </Group>
        </Stack>
    );
}

// ───────────────── MAIN ─────────────────

export default function ExaminationPage(props: {
    batchId: string;
}) {
    const isMobile = useMediaQuery("(max-width: 768px)");

    const [entries, setEntries] = useState<ExaminationItem[]>([]);

    const [page, setPage] = useState(1);

    const [isLoading, setIsLoading] = useState(false);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const [selectedExam, setSelectedExam] =
        useState<ExaminationItem | null>(null);

    const PAGE_SIZE = 6;

    const [addDrawerOpen, { open: openAdd, close: closeAdd }] =
        useDisclosure(false);

    // ───────────────── FETCH ─────────────────

    const fetchExaminations = useCallback(() => {
        if (!props.batchId) return;

        setIsLoading(true);

        GetExamination(props.batchId)
            .then((res: any) => {
                console.log("GET NOTES :", res);

                const data =
                    res?.data?.examination ||
                    res?.data?.data?.examination ||
                    [];

                const formatted: ExaminationItem[] = data.map(
                    (item: any) => ({
                        _id: item._id,
                        title: item.title,
                        url: item.url,
                    })
                );

                setEntries(formatted);
            })
            .catch((e: any) => {
                console.log(e);

                notifications.show({
                    title: "Something Went Wrong",
                    message:
                        "Unable to load study materials right now.",
                    color: "red",
                    icon: <IconX size={16} />,
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [props.batchId, setIsLoading]);

    useEffect(() => {
        fetchExaminations();
    }, [props.batchId, setIsLoading]);

    const handleDelete = async () => {
        if (!selectedExam) return;

        try {
            await DeleteExamination(selectedExam._id);

            SuccessNotification("Examination Deleted!");

            setDeleteModalOpen(false);

            fetchExaminations();
        } catch (error) {
            console.log(error);

            notifications.show({
                title: "Delete Failed",
                message: "Unable to delete examination",
                color: "red",
            });
        }
    };

    // ───────────────── PAGINATION ─────────────────

    const totalPages = Math.max(
        1,
        Math.ceil(entries.length / PAGE_SIZE)
    );

    const paginated = entries.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    // ───────────────── UI ─────────────────

    return (
        <Box
            p={isMobile ? "sm" : "xl"}
            style={{
                minHeight: "100vh",
                fontFamily: "'DM Sans', sans-serif",
            }}
        >
            {/* HEADER */}

            <Paper
                radius="28px"
                p="xl"
                mb="xl"
                style={{
                    background:
                        "linear-gradient(135deg, #5c3de8, #7b5ef8)",
                    color: "white",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                <Group justify="space-between">
                    <Stack gap={4}>
                        <Group>
                            <ThemeIcon
                                size={54}
                                radius="xl"
                                color="white"
                                variant="light"
                            >
                                <IconSparkles size={28} />
                            </ThemeIcon>

                            <div>
                                <Title order={2} c="white">
                                    Examination
                                </Title>

                                <Text c="rgba(255,255,255,0.8)">
                                    Manage examination schedules and papers
                                </Text>
                            </div>
                        </Group>
                    </Stack>

                    <Button
                        leftSection={<IconPlus size={18} />}
                        radius="xl"
                        size="md"
                        onClick={openAdd}
                        color="white"
                        c="#5c3de8"
                    >
                        Add Examination
                    </Button>
                </Group>
            </Paper>

            {/* LOADING */}

            {isLoading ? (
                <Flex justify="center" mt={80}>
                    <Loader color="violet" size="lg" />
                </Flex>
            ) : (
                <>
                    {/* EMPTY STATE */}

                    {entries.length === 0 ? (
                        <Paper
                            radius="24px"
                            p={60}
                            ta="center"
                            style={{
                                background: "#faf7ff",
                                border: "1px dashed #cdbdff",
                            }}
                        >
                            <ThemeIcon
                                size={80}
                                radius="100%"
                                mx="auto"
                                mb="md"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #5c3de8, #7b5ef8)",
                                }}
                            >
                                <IconBook size={40} />
                            </ThemeIcon>

                            <Title order={3}>
                                No Examination Found
                            </Title>

                            <Text c="dimmed" mt={6}>
                                Upload examination schedules and notices
                            </Text>

                            <Button
                                mt="xl"
                                radius="xl"
                                leftSection={<IconPlus size={18} />}
                                onClick={openAdd}
                                style={{
                                    background:
                                        "linear-gradient(135deg, #5c3de8, #7b5ef8)",
                                }}
                            >
                                Create Examination
                            </Button>
                        </Paper>
                    ) : (
                        <Paper
                            radius="24px"
                            p="lg"
                            style={{
                                background: "#fff",
                                border: "1px solid #f1ebff",
                                boxShadow:
                                    "0 10px 30px rgba(92,61,232,0.05)",
                            }}
                        >
                            <Group
                                justify="space-between"
                                mb="xl"
                            >
                                <div>
                                    <Title
                                        order={2}
                                        style={{
                                            color: "#1a1a2e",
                                            fontWeight: 700,
                                        }}
                                    >
                                        Examination Collection
                                    </Title>

                                    <Text
                                        size="sm"
                                        c="dimmed"
                                    >
                                        {entries.length} Examinations
                                    </Text>
                                </div>
                            </Group>

                            <Grid gutter="xl">
                                {paginated.map((item) => (
                                    <Grid.Col
                                        key={item._id}
                                        span={{
                                            base: 12,
                                            sm: 6,
                                            lg: 4,
                                        }}
                                    >
                                        <Paper
                                            radius="24px"
                                            p={0}
                                            style={{
                                                overflow: "hidden",
                                                background: "#ffffff",
                                                border: "1px solid #ede7ff",
                                                boxShadow: "0 12px 35px rgba(92,61,232,0.10)",
                                                transition: "all .3s ease",
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >


                                            <Stack gap={0}>
                                                <Box
                                                    style={{
                                                        aspectRatio: "16 / 10",
                                                        overflow: "hidden",
                                                        background: "#f5f5f5",
                                                        position: "relative",
                                                    }}
                                                >
                                                    <Menu shadow="md" width={180} position="bottom-end">
                                                        <Menu.Target>
                                                            <ActionIcon
                                                                variant="filled"
                                                                radius="xl"
                                                                style={{
                                                                    position: "absolute",
                                                                    top: 12,
                                                                    right: 12,
                                                                    zIndex: 10,
                                                                    background: "rgba(255,255,255,0.9)",
                                                                    color: "#333",
                                                                }}
                                                            >
                                                                <IconDotsVertical size={16} />
                                                            </ActionIcon>
                                                        </Menu.Target>

                                                        <Menu.Dropdown>
                                                            <Menu.Item
                                                                color="red"
                                                                leftSection={<IconTrash size={16} />}
                                                                onClick={() => {
                                                                    setSelectedExam(item);
                                                                    setDeleteModalOpen(true);
                                                                }}
                                                            >
                                                                Delete
                                                            </Menu.Item>
                                                        </Menu.Dropdown>
                                                    </Menu>

                                                    <img
                                                        src={item.url}
                                                        alt={item.title}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                            display: "block",
                                                        }}
                                                    />
                                                </Box>

                                                <Box
                                                    p="lg"
                                                    style={{
                                                        flex: 1,
                                                        display: "flex",
                                                        flexDirection: "column",
                                                    }}
                                                >
                                                    <Text
                                                        fw={700}
                                                        size="lg"
                                                        mb="xs"
                                                        lineClamp={2}
                                                        style={{
                                                            minHeight: "56px",
                                                        }}
                                                    >
                                                        {item.title}
                                                    </Text>

                                                    <Text
                                                        size="sm"
                                                        c="dimmed"
                                                        mb="lg"
                                                    >
                                                        Examination Schedule
                                                    </Text>

                                                    <Box style={{ flexGrow: 1 }} />

                                                    <Button
                                                        component="a"
                                                        href={item.url}
                                                        target="_blank"
                                                        radius="xl"
                                                        size="md"
                                                        fullWidth
                                                        style={{
                                                            background:
                                                                "linear-gradient(135deg,#5c3de8,#7b5ef8)",
                                                        }}
                                                    >
                                                        View Examination
                                                    </Button>
                                                </Box>
                                            </Stack>


                                        </Paper>
                                    </Grid.Col>
                                ))}
                            </Grid>

                            {entries.length > PAGE_SIZE && (
                                <Flex
                                    justify="space-between"
                                    align="center"
                                    mt="xl"
                                    direction={
                                        isMobile ? "column" : "row"
                                    }
                                    gap="sm"
                                >
                                    <Text
                                        size="sm"
                                        c="dimmed"
                                    >
                                        Showing{" "}
                                        {Math.min(
                                            (page - 1) * PAGE_SIZE + 1,
                                            entries.length
                                        )}{" "}
                                        to{" "}
                                        {Math.min(
                                            page * PAGE_SIZE,
                                            entries.length
                                        )}{" "}
                                        of {entries.length} resources
                                    </Text>

                                    <Pagination
                                        total={totalPages}
                                        value={page}
                                        onChange={setPage}
                                        radius="xl"
                                        size="sm"
                                        styles={{
                                            control: {
                                                "&[data-active]": {
                                                    background: "#5c3de8",
                                                    borderColor: "#5c3de8",
                                                },
                                            },
                                        }}
                                    />
                                </Flex>
                            )}
                        </Paper>
                    )}
                </>
            )}

            <Modal
                opened={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Delete Examination"
                centered
                radius="xl"
            >
                <Text mb="lg">
                    Are you sure you want to delete this examination?
                </Text>

                <Group justify="flex-end">
                    <Button
                        variant="default"
                        radius="xl"
                        onClick={() => setDeleteModalOpen(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        color="red"
                        radius="xl"
                        leftSection={<IconTrash size={16} />}
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </Group>
            </Modal>

            {/* DRAWER */}

            <Drawer
                opened={addDrawerOpen}
                onClose={closeAdd}
                title={
                    <Group gap="xs">
                        <ThemeIcon
                            size={34}
                            radius="xl"
                            style={{
                                background:
                                    "linear-gradient(135deg, #5c3de8, #7b5ef8)",
                            }}
                        >
                            <IconBook size={18} />
                        </ThemeIcon>

                        <Text fw={700} size="lg">
                            Add Examination
                        </Text>
                    </Group>
                }
                position="right"
                size={isMobile ? "100%" : 460}
                padding="xl"
            >
                <EntryForm
                    onCancel={closeAdd}
                    batchId={props.batchId}
                    fetchNotes={fetchExaminations}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                />
            </Drawer>
        </Box>
    );
}