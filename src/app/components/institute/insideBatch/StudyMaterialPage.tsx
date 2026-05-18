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

import {
    IconPlus,
    IconBook,
    IconCheck,
    IconX,
    IconUpload,
    IconFileDescription,
    IconDownload,
    IconSparkles,
} from "@tabler/icons-react";

import { notifications } from "@mantine/notifications";

import {
    CreateNotes,
} from "@/axios/institute/InstitutePostApi";

import { GetAllNotes } from "@/axios/institute/InstituteGetApi";

import { SuccessNotification } from "@/app/helperFunction/Notification";
import { UploadNotes } from "@/axios/institute/InstitutePutApi";

// ───────────────── TYPES ─────────────────

interface StudyMaterial {
    id: string;
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

            formData.append("notes", file);

            // STEP 1 → Upload
            const uploadRes: any = await UploadNotes(formData);

            console.log("UPLOAD RES :", uploadRes);

            const uploadedUrl =
                uploadRes?.url ||
                uploadRes?.data?.url ||
                uploadRes?.response?.url;

            // STEP 2 → Save
            await CreateNotes({
                batchId,
                url: uploadedUrl,
                title: title,
            });

            SuccessNotification("Study Material Added!");

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
                label="Material Title"
                placeholder="Enter material title"
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
                label="Upload Notes / PDF"
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
                    Upload Material
                </Button>
            </Group>
        </Stack>
    );
}

// ───────────────── MAIN ─────────────────

export default function StudyMaterialPage(props: {
    batchId: string;
}) {
    const isMobile = useMediaQuery("(max-width: 768px)");

    const [entries, setEntries] = useState<StudyMaterial[]>([]);

    const [page, setPage] = useState(1);

    const [isLoading, setIsLoading] = useState(false);

    const PAGE_SIZE = 6;

    const [addDrawerOpen, { open: openAdd, close: closeAdd }] =
        useDisclosure(false);

    // ───────────────── FETCH ─────────────────

    const fetchNotes = useCallback(() => {
        if (!props.batchId) return;

        setIsLoading(true);

        GetAllNotes(props.batchId)
            .then((res: any) => {
                console.log("GET NOTES :", res);

                const data = res?.data?.notes || [];

                const formatted: StudyMaterial[] = data.map(
                    (item: any, index: number) => ({
                        id: item._id,
                        title:
                            item.title ||
                            `Study Material ${index + 1}`,
                        url: item.url || "#",
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
        fetchNotes();
    }, [props.batchId, setIsLoading]);

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
                                    Study Materials
                                </Title>

                                <Text c="rgba(255,255,255,0.8)">
                                    Manage all notes and resources
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
                        Upload Material
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
                                No Resources Found
                            </Title>

                            <Text c="dimmed" mt={6}>
                                Upload study materials for students
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
                                Upload Material
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
                                        {entries.length} Resources
                                    </Title>

                                    <Text
                                        size="sm"
                                        c="dimmed"
                                    >
                                        Uploaded study materials
                                    </Text>
                                </div>

                                <Button
                                    leftSection={<IconDownload size={16} />}
                                    radius="xl"
                                    variant="light"
                                    color="violet"
                                >
                                    Download All
                                </Button>
                            </Group>

                            <Grid gutter="md">
                                {paginated.map((item) => (
                                    <Grid.Col
                                        key={item.id}
                                        span={{
                                            base: 12,
                                            md: 6,
                                        }}
                                    >
                                        <Paper
                                            radius="18px"
                                            p="md"
                                            style={{
                                                border: "1px solid #f0ebff",
                                                background: "#fff",
                                            }}
                                        >
                                            <Group justify="space-between">
                                                <Group gap="md">
                                                    <ThemeIcon
                                                        size={48}
                                                        radius="xl"
                                                        variant="light"
                                                        color="violet"
                                                    >
                                                        <IconFileDescription size={22} />
                                                    </ThemeIcon>

                                                    <div>
                                                        <Text
                                                            fw={600}
                                                            size="md"
                                                            style={{
                                                                color: "#1a1a2e",
                                                            }}
                                                        >
                                                            {item.title}
                                                        </Text>

                                                        <Text
                                                            size="sm"
                                                            c="dimmed"
                                                        >
                                                            Uploaded Material
                                                        </Text>
                                                    </div>
                                                </Group>

                                                <Button
                                                    component="a"
                                                    href={item.url || undefined}
                                                    target="_blank"
                                                    variant="subtle"
                                                    radius="xl"
                                                    color="violet"
                                                    title={
                                                        item.url === "#"
                                                            ? "File is not available right now"
                                                            : "Download Material"
                                                    }
                                                >
                                                    <IconDownload size={20} />
                                                </Button>
                                            </Group>
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
                            Upload Study Material
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
                    fetchNotes={fetchNotes}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                />
            </Drawer>
        </Box>
    );
}