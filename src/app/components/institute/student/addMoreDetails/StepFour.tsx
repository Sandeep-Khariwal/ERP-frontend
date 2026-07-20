// "use client";

// import { useEffect, useState, useRef } from "react";
// import { 
//   Box, Text, Stack, Divider, LoadingOverlay, 
//   Flex, Grid, Paper, Title, Group, Avatar, Button 
// } from "@mantine/core";
// import { GetStudentDetail } from "@/axios/institute/InstituteGetApi";
// import html2pdf from "html2pdf.js";

// const StepFour = ({ studentId }: { studentId: string }) => {
//   const [overview, setOverview] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const printRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!studentId) return;
//     setLoading(true);
//     GetStudentDetail(studentId)
//       .then((res: any) => {
//         setOverview(res?.student || res);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setLoading(false);
//       });
//   }, [studentId]);

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleDownload = () => {
//     if (!printRef.current) return;
//     const element = printRef.current;
//     const opt:any = {
//       margin: 0,
//       filename: `Admission_${overview?.name}.pdf`,
//       image: { type: "jpeg", quality: 1 },
//       html2canvas: { scale: 2, useCORS: true },
//       jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
//     };
//     html2pdf().set(opt).from(element).save();
//   };

//   if (loading) return <LoadingOverlay visible overlayProps={{ blur: 2 }} />;
//   if (!overview) return <Text ta="center" mt="xl" c="dimmed">No Data Found</Text>;

//   const InfoLabel = ({ children }: { children: React.ReactNode }) => (
//     <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={0.5} mb={1}>
//       {children}
//     </Text>
//   );

//   return (
//     <>
//       <style jsx global>{`
//         @media print {
//           @page {
//             size: A4;
//             margin: 0; /* Page margins zero taaki content fit ho */
//           }
//           body * {
//             visibility: hidden;
//           }
//           .printable-area, .printable-area * {
//             visibility: visible;
//           }
//           .printable-area {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 210mm; /* A4 Width */
//             height: 297mm; /* A4 Height */
//             margin: 0 !important;
//             padding: 10mm !important; /* Internal padding for safe print */
//             box-sizing: border-box;
//           }
//           .no-print {
//             display: none !important;
//           }
//         }
//       `}</style>

//       {/* Buttons */}
//       <Group justify="flex-end" mb="md" className="no-print">
//         <Button variant="default" onClick={handlePrint}>Print Form</Button>
//         <Button color="violet" onClick={handleDownload}>Download PDF</Button>
//       </Group>

//       {/* Main Document */}
//       <div ref={printRef} className="printable-area">
//         <Paper
//           p={30} // Padding thoda kam kiya fit karne ke liye
//           bg="white"
//           style={{
//             borderRadius: 15,
//             border: "1px solid #e0e0e0",
//             borderTop: "8px solid #6A11CB",
//             maxWidth: "100%",
//             minHeight: "280mm", // Ensures it fills most of the page but stays on one
//             position: "relative",
//             overflow: "hidden",
//             backgroundColor: 'white'
//           }}
//         >
//           {/* WATERMARK */}
//           <Box
//             style={{
//               position: "absolute",
//               top: "25%",
//               left: "50%",
//               transform: "translateX(-50%) rotate(-15deg)",
//               opacity: 0.03,
//               zIndex: 0,
//               pointerEvents: 'none'
//             }}
//           >
//             <img src={overview.instituteId.logo} alt="Not found" height={300} width={300} />
//             <Text size="50px">{overview.instituteId?.name}</Text>
//           </Box>

//           <Stack gap="md" style={{ position: "relative", zIndex: 1 }}>
//             {/* HEADER */}
//             <Flex justify="space-between" align="center">
//               <Box>
//                 <Title order={3} c="#6A11CB" fw={800}>
//                   {overview.instituteId?.name || "Institute Name"}
//                 </Title>
//                 <Text fw={600} size="xs" c="dimmed" tt="uppercase" lts={1}>
//                   Academic Admission Form
//                 </Text>
//               </Box>
//               {overview.instituteId?.logo && (
//                 <Avatar src={overview.instituteId.logo} size={60} radius="md" />
//               )}
//             </Flex>

//             <Divider variant="dashed" />

//             {/* STUDENT SECTION */}
//             <Box>
//               <Title order={6} c="#6A11CB" mb={10} tt="uppercase">Student Profile</Title>
//               <Grid gutter="md">
//                 <Grid.Col span={6}>
//                   <InfoLabel>Full Name</InfoLabel>
//                   <Text fw={600} size="sm">{overview.name || "-"}</Text>
//                 </Grid.Col>
//                 <Grid.Col span={6}>
//                   <InfoLabel>Gender</InfoLabel>
//                   <Text fw={600} size="sm">{overview.gender || "-"}</Text>
//                 </Grid.Col>
//                 <Grid.Col span={6}>
//                   <InfoLabel>Date of Birth</InfoLabel>
//                   <Text fw={600} size="sm">
//                     {overview.dateOfBirth ? formatDate(overview.dateOfBirth) : "-"}
//                   </Text>
//                 </Grid.Col>
//                 <Grid.Col span={6}>
//                   <InfoLabel>Phone Number</InfoLabel>
//                   <Text fw={600} size="sm">{overview.phoneNumber?.[0] || "-"}</Text>
//                 </Grid.Col>
//                 <Grid.Col span={12}>
//                   <InfoLabel>Address</InfoLabel>
//                   <Text fw={600} size="sm">{overview.address || "N/A"}</Text>
//                 </Grid.Col>
//               </Grid>
//             </Box>

//             {/* PARENT & ACADEMIC */}
//             <SimpleGrid cols={2} spacing="xl">
//               <Box>
//                 <Title order={6} c="#6A11CB" mb={5} tt="uppercase">Guardian Info</Title>
//                 <Paper withBorder p="xs" radius="md">
//                   <InfoLabel>Name</InfoLabel>
//                   <Text fw={600} size="sm">{overview.parentName}</Text>
//                   <InfoLabel>Phone</InfoLabel>
//                   <Text fw={600} size="sm">{overview.parentNumber}</Text>
//                 </Paper>
//               </Box>
//               <Box>
//                 <Title order={6} c="#6A11CB" mb={5} tt="uppercase">Academic Status</Title>
//                 <Paper withBorder p="xs" radius="md">
//                   <InfoLabel>Batch</InfoLabel>
//                   <Text fw={600} size="sm" c="#6A11CB">{overview.batchId?.name}</Text>
//                   <InfoLabel>Joining Date</InfoLabel>
//                   <Text fw={600} size="sm">{overview.dateOfJoining ? new Date(overview.dateOfJoining).toDateString() : "-"}</Text>
//                 </Paper>
//               </Box>
//             </SimpleGrid>

//             {/* DECLARATION */}
//             <Box p="sm" style={{ borderRadius: 8, backgroundColor: "#F8F0FF", borderLeft: "4px solid #6A11CB" }}>
//               <Text size="xs" lh={1.4}>
//                 <b>Declaration:</b> I hereby declare that the information provided is true and correct.
//               </Text>
//             </Box>

//             {/* SIGNATURES */}
//             <Flex justify="space-between" mt={30}>
//               <Box ta="center" style={{ width: 150 }}>
//                 <Box h={40} style={{ borderBottom: "1px solid #E0E0E0" }} />
//                 <Text size="xs" fw={700} mt={5} c="dimmed">Student Sign</Text>
//               </Box>
//               <Box ta="center" style={{ width: 150 }}>
//                 <Box h={40} style={{ borderBottom: "1px solid #6A11CB", position: 'relative' }}>
//                   {overview.instituteId?.signature && (
//                     <img src={overview.instituteId.signature} height={35} style={{ mixBlendMode: 'multiply' }} />
//                   )}
//                 </Box>
//                 <Text size="xs" fw={700} mt={5} c="#6A11CB">Director OR Principal Sign</Text>
//               </Box>
//             </Flex>

//             <Divider />
//             <Text ta="center" size="xs" c="dimmed">Computer Generated | Official Document</Text>
//           </Stack>
//         </Paper>
//       </div>
//     </>
//   );
// };

// // SimpleGrid import fix if needed
// import { SimpleGrid } from "@mantine/core";
// import Image from "next/image";
// import { formatDate } from "@/app/components/marketing/utility/utils";

// export default StepFour;


"use client";

import { useEffect, useState, useRef } from "react";
import {
  Box, Text, Stack, Divider, LoadingOverlay,
  Flex, Grid, Paper, Title, Group, Avatar, Button, SimpleGrid
} from "@mantine/core";
import { GetStudentDetail } from "@/axios/institute/InstituteGetApi";
import { formatDate } from "@/app/components/marketing/utility/utils";

const StepFour = ({ studentId }: { studentId: string }) => {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    GetStudentDetail(studentId)
      .then((res: any) => {
        setOverview(res?.student || res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [studentId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!printRef.current) return;

    // Dynamic import: html2pdf.js touches `self`/`window` on load,
    // so it must only be loaded in the browser, not during SSR.
    const html2pdf = (await import("html2pdf.js")).default;

    const element = printRef.current;
    const opt: any = {
      margin: 0,
      filename: `Admission_${overview?.name}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  if (loading) return <LoadingOverlay visible overlayProps={{ blur: 2 }} />;
  if (!overview) return <Text ta="center" mt="xl" c="dimmed">No Data Found</Text>;

  const InfoLabel = ({ children }: { children: React.ReactNode }) => (
    <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={0.5} mb={1}>
      {children}
    </Text>
  );

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0; /* Page margins zero taaki content fit ho */
          }
          body * {
            visibility: hidden;
          }
          .printable-area, .printable-area * {
            visibility: visible;
          }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm; /* A4 Width */
            height: 297mm; /* A4 Height */
            margin: 0 !important;
            padding: 10mm !important; /* Internal padding for safe print */
            box-sizing: border-box;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Buttons */}
      <Group justify="flex-end" mb="md" className="no-print">
        <Button variant="default" onClick={handlePrint}>Print Form</Button>
        <Button color="violet" onClick={handleDownload}>Download PDF</Button>
      </Group>

      {/* Main Document */}
      <div ref={printRef} className="printable-area">
        <Paper
          p={30} // Padding thoda kam kiya fit karne ke liye
          bg="white"
          style={{
            borderRadius: 15,
            border: "1px solid #e0e0e0",
            borderTop: "8px solid #6A11CB",
            maxWidth: "100%",
            minHeight: "280mm", // Ensures it fills most of the page but stays on one
            position: "relative",
            overflow: "hidden",
            backgroundColor: 'white'
          }}
        >
          {/* WATERMARK */}
          <Box
            style={{
              position: "absolute",
              top: "25%",
              left: "50%",
              transform: "translateX(-50%) rotate(-15deg)",
              opacity: 0.03,
              zIndex: 0,
              pointerEvents: 'none'
            }}
          >
            <img src={overview.instituteId.logo} alt="Not found" height={300} width={300} />
            <Text size="50px">{overview.instituteId?.name}</Text>
          </Box>

          <Stack gap="md" style={{ position: "relative", zIndex: 1 }}>
            {/* HEADER */}
            <Flex justify="space-between" align="center">
              <Box>
                <Title order={3} c="#6A11CB" fw={800}>
                  {overview.instituteId?.name || "Institute Name"}
                </Title>
                <Text fw={600} size="xs" c="dimmed" tt="uppercase" lts={1}>
                  Academic Admission Form
                </Text>
              </Box>
              {overview.instituteId?.logo && (
                <Avatar src={overview.instituteId.logo} size={60} radius="md" />
              )}
            </Flex>

            <Divider variant="dashed" />

            {/* STUDENT SECTION */}
            <Box>
              <Title order={6} c="#6A11CB" mb={10} tt="uppercase">Student Profile</Title>
              <Grid gutter="md">
                <Grid.Col span={6}>
                  <InfoLabel>Full Name</InfoLabel>
                  <Text fw={600} size="sm">{overview.name || "-"}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <InfoLabel>Gender</InfoLabel>
                  <Text fw={600} size="sm">{overview.gender || "-"}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <InfoLabel>Date of Birth</InfoLabel>
                  <Text fw={600} size="sm">
                    {overview.dateOfBirth ? formatDate(overview.dateOfBirth) : "-"}
                  </Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <InfoLabel>Phone Number</InfoLabel>
                  <Text fw={600} size="sm">{overview.phoneNumber?.[0] || "-"}</Text>
                </Grid.Col>
                <Grid.Col span={12}>
                  <InfoLabel>Address</InfoLabel>
                  <Text fw={600} size="sm">{overview.address || "N/A"}</Text>
                </Grid.Col>
              </Grid>
            </Box>

            {/* PARENT & ACADEMIC */}
            <SimpleGrid cols={2} spacing="xl">
              <Box>
                <Title order={6} c="#6A11CB" mb={5} tt="uppercase">Guardian Info</Title>
                <Paper withBorder p="xs" radius="md">
                  <InfoLabel>Name</InfoLabel>
                  <Text fw={600} size="sm">{overview.parentName}</Text>
                  <InfoLabel>Phone</InfoLabel>
                  <Text fw={600} size="sm">{overview.parentNumber}</Text>
                </Paper>
              </Box>
              <Box>
                <Title order={6} c="#6A11CB" mb={5} tt="uppercase">Academic Status</Title>
                <Paper withBorder p="xs" radius="md">
                  <InfoLabel>Batch</InfoLabel>
                  <Text fw={600} size="sm" c="#6A11CB">{overview.batchId?.name}</Text>
                  <InfoLabel>Joining Date</InfoLabel>
                  <Text fw={600} size="sm">{overview.dateOfJoining ? new Date(overview.dateOfJoining).toDateString() : "-"}</Text>
                </Paper>
              </Box>
            </SimpleGrid>

            {/* DECLARATION */}
            <Box p="sm" style={{ borderRadius: 8, backgroundColor: "#F8F0FF", borderLeft: "4px solid #6A11CB" }}>
              <Text size="xs" lh={1.4}>
                <b>Declaration:</b> I hereby declare that the information provided is true and correct.
              </Text>
            </Box>

            {/* SIGNATURES */}
            <Flex justify="space-between" mt={30}>
              <Box ta="center" style={{ width: 150 }}>
                <Box h={40} style={{ borderBottom: "1px solid #E0E0E0" }} />
                <Text size="xs" fw={700} mt={5} c="dimmed">Student Sign</Text>
              </Box>
              <Box ta="center" style={{ width: 150 }}>
                <Box h={40} style={{ borderBottom: "1px solid #6A11CB", position: 'relative' }}>
                  {overview.instituteId?.signature && (
                    <img src={overview.instituteId.signature} height={35} style={{ mixBlendMode: 'multiply' }} />
                  )}
                </Box>
                <Text size="xs" fw={700} mt={5} c="#6A11CB">Director OR Principal Sign</Text>
              </Box>
            </Flex>

            <Divider />
            <Text ta="center" size="xs" c="dimmed">Computer Generated | Official Document</Text>
          </Stack>
        </Paper>
      </div>
    </>
  );
};

export default StepFour;