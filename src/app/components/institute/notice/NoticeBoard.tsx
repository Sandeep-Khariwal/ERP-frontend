"use client";

import {
  Button,
  Card,
  Container,
  Group,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  Select,
  Flex,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import CreateNoticeCard from "./CreateNoticeCard";
import { useSelector } from "react-redux";
import { CreateNotice } from "@/axios/notice/NoticePostApi";
import { SuccessNotification } from "@/app/helperFunction/Notification";
import { GetAllNotice } from "@/axios/notice/NoticeGetApi";

// Types
interface Notice {
  _id: string;
  title: string;
  noticeType: string;
  fromDate: string;
  toDate?: string;
  institute: string;
  description: string;
}

// Component
export default function NoticeBoard(props: { userType: string }) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const institute = useSelector(
    (state: any) => state.instituteSlice.instituteDetails
  );

  // Form
  const form = useForm({
    initialValues: {
      title: "",
      noticeType: "",
      description: "",
      fromDate: new Date(),
      toDate: null as Date | null,
      institute: "",
    },
    validate: {
      title: (value) =>
        value.length < 3 ? "Title must be at least 3 chars" : null,
      noticeType: (value) => (!value ? "Please select type" : null),
      description: (value) => (!value ? "Description required" : null),
    },
  });

  useEffect(() => {
    if (institute?._id) {
      form.setFieldValue("institute", institute._id!);
      fetchNotices();
    }
  }, [institute]);

  // Fetch notices
  const fetchNotices = async () => {
    GetAllNotice(institute._id!)
      .then((x: any) => {
        if (x?.data) setNotices(x.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // Submit
  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    CreateNotice(values)
      .then((x: any) => {
        setLoading(false);
        fetchNotices();
        SuccessNotification("Notice added successfully!!");
        setOpened(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };

  return (
    <Stack w={"100%"} p="xl">
      <LoadingOverlay visible={loading} />
      <Flex align={"center"} justify={"start"} gap={20}>
        <Title order={2}>Notice Board</Title>
        {/* <CreateNoticeCard/> */}
        {props.userType === "admin" && (
          <Button onClick={() => setOpened(true)} radius="md" color="indigo">
            + Create Notice
          </Button>
        )}
      </Flex>

      {/* Notice List */}
      <ScrollArea mih={500}>
        <Stack>
          {notices.length === 0 ? (
            <Text c="dimmed">No notices available</Text>
          ) : (
            notices.map((notice) => (
              <Card
                key={notice._id}
                shadow="md"
                p="lg"
                radius="md"
                withBorder
                w={"80%"}
                style={{ background: "#f9f9fb" }}
              >
                <Title order={4}>{notice.title}</Title>
                <Text size="sm" c="dimmed">
                  {notice.noticeType} |{" "}
                  {new Date(notice.fromDate).toDateString()}{" "}
                  {notice.toDate &&
                    ` - ${new Date(notice.toDate).toDateString()}`}
                </Text>
                <Text mt="sm">{notice.description}</Text>
                <Text mt="sm" size="xs" c="dimmed">
                  Institute: {notice.institute}
                </Text>
              </Card>
            ))
          )}
        </Stack>
      </ScrollArea>

      {/* Create Notice Modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Create New Notice"
        centered
        size="lg"
      >
        <LoadingOverlay visible={loading} />
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput label="Title" {...form.getInputProps("title")} />
            <Select
              label="Notice Type"
              placeholder="Select type"
              data={["General", "Exam", "Holiday", "Event"]}
              {...form.getInputProps("noticeType")}
            />
            <Textarea
              label="Description"
              minRows={3}
              autosize
              {...form.getInputProps("description")}
            />
            <Group grow>
              <Stack>
                <Text>From Date </Text>
                <DatePicker
                  value={form.values.fromDate}
                  onChange={(val: any) => form.setFieldValue("fromDate", val!)}
                />
              </Stack>

              <Stack>
                <Text>To Date </Text>
                <DatePicker
                  value={form.values.toDate}
                  onChange={(val: any) => form.setFieldValue("toDate", val)}
                />
              </Stack>
            </Group>
            <Group mt="md">
              <Button type="submit" color="blue" radius="md">
                Save Notice
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
