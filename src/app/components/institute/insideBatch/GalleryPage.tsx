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
    IconSparkles,
} from "@tabler/icons-react";

import { notifications } from "@mantine/notifications";

import { CreateGallery } from "@/axios/institute/InstitutePostApi";
import { GetGallery } from "@/axios/institute/InstituteGetApi";
import { UploadThumbnail } from "@/axios/institute/InstitutePutApi";
import { SuccessNotification } from "@/app/helperFunction/Notification";

// ───────────────── TYPES ─────────────────

interface GalleryItem {
    id: string;
    title: string;
    url: string;
    coverPhoto: string;
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
    const [link, setLink] = useState("");

    const handleSave = async () => {
        if (!title || !link || !file) {
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

            formData.append("thumbnail", file);

            // STEP 1 → Upload
            const uploadRes: any = await UploadThumbnail(formData);

            console.log("UPLOAD RES :", uploadRes);

            const uploadedUrl =
                uploadRes?.url ||
                uploadRes?.data?.url ||
                uploadRes?.response?.url;

            await CreateGallery({
                batchId,
                title,
                url: link,
                coverPhoto: uploadedUrl,
            });

            SuccessNotification("Gallery Added!");

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
                label="Gallery Title"
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

            <TextInput
                label="Gallery Link"
                placeholder="Facebook / Reel Link"
                value={link}
                onChange={(e) => setLink(e.currentTarget.value)}
                radius="xl"
            />

            <FileInput
                label="Cover Photo"
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
                    Create Gallery
                </Button>
            </Group>
        </Stack>
    );
}

// ───────────────── MAIN ─────────────────

export default function GalleryPage(props: {
    batchId: string;
}) {
    const isMobile = useMediaQuery("(max-width: 768px)");

    const [entries, setEntries] = useState<GalleryItem[]>([]);

    const [page, setPage] = useState(1);

    const [isLoading, setIsLoading] = useState(false);

    const PAGE_SIZE = 6;

    const [addDrawerOpen, { open: openAdd, close: closeAdd }] =
        useDisclosure(false);

    // ───────────────── FETCH ─────────────────

    const fetchGallery = useCallback(() => {
        if (!props.batchId) return;

        setIsLoading(true);

        GetGallery(props.batchId)
            .then((res: any) => {
                console.log("GET NOTES :", res);

                const data =
                    res?.data?.gallery ||
                    res?.data?.data?.gallery ||
                    [];

                const formatted: GalleryItem[] = data.map(
                    (item: any) => ({
                        id: item._id,
                        title: item.title,
                        url: item.url,
                        coverPhoto: item.coverPhoto,
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
        fetchGallery();
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
                                    Gallery
                                </Title>

                                <Text c="rgba(255,255,255,0.8)">
                                    Manage gallery photos and links
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
                        Add Gallery
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
                                No Gallery Found
                            </Title>

                            <Text c="dimmed" mt={6}>
                                Upload photos and gallery links for students
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
                                Create Gallery
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
                                        Gallery Collection
                                    </Title>

                                    <Text
                                        size="sm"
                                        c="dimmed"
                                    >
                                        {entries.length} Photos & Media Links
                                    </Text>
                                </div>
                            </Group>

                            <Grid gutter="xl">
                                {paginated.map((item) => (
                                    <Grid.Col
                                        key={item.id}
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
                                                            }}
                                                        >
                                                            <img
                                                                src={item.coverPhoto}
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
                                                                Gallery Photo & Media Link
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
                                                                View Gallery
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
                            Add Gallery
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
                    fetchNotes={fetchGallery}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                />
            </Drawer>
        </Box>
    );
}