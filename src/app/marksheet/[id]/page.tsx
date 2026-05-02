"use client"
import { GetMarksheetVerify, GetStudentDetail } from '@/axios/institute/InstituteGetApi';
import {
    Stack,
    Text,
    Box,
    Badge,
    Center,
    Loader,
    Paper,
    Grid,
    Divider,
    Table,
    Image,
    Group,
    Container,
    Title
} from '@mantine/core'
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Types for better DX
interface MarksheetData {
    studentName: string;
    fName: string;
    dob: string;
    photo: string;
    address: string;
    parentNumber: string;
    enrolment: string;
    rollNumber: number;
    instituteName: string;
    instituteLogo: string;
    instituteAdress: string;
    institutePhone: string;
    principalSignature: string;
    allsubjecttotal: number;
    batchName: string;
    examName: string;
    formattedDate: string;
    marks: any[];
    totalMarks: number;
    percentage: number;
    overallGrade: string;
    status: string;
    session: string;
}

function Page() {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<MarksheetData | null>(null);

    useEffect(() => {
        if (!params.id) return;

        GetMarksheetVerify(params.id.toString())
            .then((res: any) => {
                const marksheet = res.marksheet;
                GetStudentDetail(marksheet.student._id)
                    .then((studentRes: any) => {
                        const student = studentRes.student;
                        setData({
                            ...marksheet,
                            studentName: student.name,
                            fName: student.parentName,
                            dob: new Date(student.dateOfBirth).toLocaleDateString('en-GB'),
                            photo: student.profilePic,
                            address: student.address,
                            parentNumber: student.parentNumber,
                            enrolment: student.enrollmentNo,
                            rollNumber: student.rollNumber,
                            instituteName: student.instituteId.name,
                            instituteLogo: student.instituteId.logo,
                            instituteAdress: student.instituteId.address,
                            institutePhone: student.instituteId.institutePhoneNumber,
                            principalSignature: student.instituteId.signature,
                            allsubjecttotal: marksheet.marks.length * 100,
                            batchName: marksheet.batch.name,
                            examName: marksheet.name,
                            formattedDate: new Date(marksheet.date).toLocaleDateString('en-GB')
                        });
                        setLoading(false);
                    })
            })
            .catch(() => setLoading(false));
    }, [params.id]);

    if (loading) return <Center h="100vh"><Loader color="blue" size="xl" type="bars" /></Center>;
    if (!data) return <Center h="100vh"><Text c="red" fw={700}>Invalid Marksheet Record</Text></Center>;

    return (
        <Box bg="gray.1" py={{ base: 20, md: 50 }} style={{ minHeight: '100vh' }}>
            <Container size="md">
                <Stack gap="xl">

                    {/* Verification Header */}
                    <Paper shadow="md" p={{ base: 'sm', md: 'md' }} radius="md" withBorder style={{ borderLeft: '6px solid #2b8a3e' }}>
                        <Group justify="space-between" wrap="wrap">
                            <Stack gap={0}>
                                <Group gap="xs" wrap="wrap">
                                    <Badge color="green" variant="filled" size="lg">VERIFIED RECORD</Badge>
                                </Group>
                                <Text fw={600} size="md" mt={5}>
                                    Digitally Signed by {data.instituteName}
                                </Text>
                            </Stack>

                            <Box>
                                <Text size="xs" c="dimmed">Verification Date</Text>
                                <Text fw={700}>{data.formattedDate}</Text>
                            </Box>
                        </Group>
                    </Paper>

                    {/* Main Marksheet */}
                    <Paper shadow="xl" p={0} radius="sm" withBorder style={{ overflow: 'hidden' }}>

                        {/* Header */}
                        <Box p={{ base: 'md', md: 'xl' }} bg="blue.9" c="white">
                            <Grid align="center">

                                <Grid.Col span={{ base: 12, md: 2 }}>
                                    <Center>
                                        <Image src={data.instituteLogo} w={80} h={80} fit="contain" bg="white" p={5} radius="md" />
                                    </Center>
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 7 }}>
                                    <Title order={3} ta={{ base: 'center', md: 'left' }}>
                                        {data.instituteName.toUpperCase()}
                                    </Title>
                                    <Text size="xs" opacity={0.8} ta={{ base: 'center', md: 'left' }}>
                                        {data.instituteAdress}
                                    </Text>
                                    <Text size="xs" opacity={0.8} ta={{ base: 'center', md: 'left' }}>
                                        Contact: {data.institutePhone || 'N/A'}
                                    </Text>
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, md: 3 }} ta={{ base: 'center', md: 'right' }}>
                                    <Title order={4} opacity={0.7}>MARKSHEET</Title>
                                    <Text fw={700}>{data.examName}</Text>
                                </Grid.Col>

                            </Grid>
                        </Box>

                        {/* Body */}
                        <Box p={{ base: 'md', md: 'xl' }}>

                            <Grid gutter="xl">

                                {/* Photo */}
                                <Grid.Col span={{ base: 12, md: 3 }}>
                                    <Center>
                                        <Paper withBorder p={4} radius="sm" shadow="sm">
                                            <Image
                                                src={data.photo}
                                                radius="sm"
                                                h={160}
                                                fallbackSrc="https://placehold.co/200x250?text=No+Photo"
                                            />
                                        </Paper>
                                    </Center>
                                </Grid.Col>

                                {/* Details */}
                                <Grid.Col span={{ base: 12, md: 9 }}>
                                    <Grid gutter="sm">
                                        <DetailItem label="Student Name" value={data.studentName} />
                                        <DetailItem label="Enrollment No" value={data.enrolment} />
                                        <DetailItem label="Father's Name" value={data.fName} />
                                        <DetailItem label="Class/Batch" value={data.batchName} />
                                        <DetailItem label="Roll Number" value={data.rollNumber} />
                                        <DetailItem label="Date of Birth" value={data.dob} />
                                        <DetailItem label="Academic Session" value={data?.session} />
                                        <DetailItem label="Address" value={data.address} />
                                    </Grid>
                                </Grid.Col>

                            </Grid>

                            <Divider my="xl" label="ACADEMIC PERFORMANCE" labelPosition="center" />

                            {/* Table (scroll fix) */}
                            <Box style={{ overflowX: 'auto' }}>
                                <Table striped highlightOnHover withColumnBorders verticalSpacing="sm" miw={600}>
                                    <Table.Thead bg="gray.0">
                                        <Table.Tr>
                                            <Table.Th>Subject</Table.Th>
                                            <Table.Th ta="center">Practical</Table.Th>
                                            <Table.Th ta="center">Theory</Table.Th>
                                            <Table.Th ta="center">Marks</Table.Th>
                                            <Table.Th ta="center">Grade</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>

                                    <Table.Tbody>
                                        {data.marks.map((row, index) => (
                                            <Table.Tr key={index}>
                                                <Table.Td fw={600}>{row.subjectName}</Table.Td>
                                                <Table.Td ta="center">{row.practical_marks}</Table.Td>
                                                <Table.Td ta="center">{row.theory_marks}</Table.Td>
                                                <Table.Td ta="center" fw={700} c="blue.8">
                                                    {row.obtained_marks}
                                                </Table.Td>
                                                <Table.Td ta="center">
                                                    <Badge variant="light">{row.grade}</Badge>
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            </Box>

                            {/* Score */}
                            <Paper mt="xl" p="md" bg="blue.0" withBorder>
                                <Grid>

                                    <Grid.Col span={{ base: 6, md: 3 }}>
                                        <Text size="xs">Total</Text>
                                        <Text fw={800}>{data.totalMarks} / {data.allsubjecttotal}</Text>
                                    </Grid.Col>

                                    <Grid.Col span={{ base: 6, md: 3 }}>
                                        <Text size="xs">%</Text>
                                        <Text fw={800}>{data.percentage}%</Text>
                                    </Grid.Col>

                                    <Grid.Col span={{ base: 6, md: 3 }}>
                                        <Text size="xs">Grade</Text>
                                        <Text fw={800}>{data.overallGrade}</Text>
                                    </Grid.Col>

                                    <Grid.Col span={{ base: 6, md: 3 }}>
                                        <Text size="xs">Result</Text>
                                        <Badge color={data.status === 'Pass' ? 'green' : 'red'}>
                                            {data.status}
                                        </Badge>
                                    </Grid.Col>

                                </Grid>
                            </Paper>

                            {/* Signature */}
                            <Group justify="center" mt={40}>
                                <Stack align="center" gap={0}>
                                    <Image src={data.principalSignature} w={120} />
                                    <Divider w={150} />
                                    <Text fw={700}>Director / Principal</Text>
                                </Stack>
                            </Group>

                        </Box>
                    </Paper>
                </Stack>
            </Container>
        </Box>
    );
}

// Sub-component for responsive detail items
const DetailItem = ({ label, value }: { label: string; value: any }) => (
    <Grid.Col span={{ base: 12, sm: 6 }}>
        <Group gap="xs" wrap="nowrap">
            <Text size="xs" fw={700} c="blue.9" w={{ base: 90, sm: 110 }} style={{ flexShrink: 0 }}>{label}:</Text>
            <Text size="xs" style={{ borderBottom: '1px solid #e9ecef', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value || '---'}</Text>
        </Group>
    </Grid.Col>
);

export default Page;