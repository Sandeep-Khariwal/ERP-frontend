

// "use client";

// import { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Group,
//   Text,
//   Badge,
//   SimpleGrid,
//   Card,
//   Stack,
//   Title,
//   Divider,
// } from "@mantine/core";
// import { IconCheck, IconDeviceFloppy } from "@tabler/icons-react";
// import {
//   createMarksheetPdf,
//   createCombinedMarksheetPdf,
// } from "./CreateMarksheetPdf";
// import { GetMarksheetDesign, SaveMarksheetDesign } from "@/axios/institute/InstitutePostApi";

// // ─────────────────────────────────────────────────────────────────────────────
// // DUMMY DATA  (only for preview)
// // ─────────────────────────────────────────────────────────────────────────────

// const dummySingle = {
//   instituteLogo: "https://placehold.co/90x90?text=LOGO",
//   instituteName: "Delhi Public School",
//   instituteAdress: "123, Main Road, New Delhi - 110001",
//   institutePhone: "9876543210",
//   batchName: "10th",
//   section: "A",
//   session: "2024-25",
//   studentName: "Rahul Sharma",
//   rollNumber: "101",
//   fName: "Rajesh Sharma",
//   enrolment: "DPS-2024-101",
//   dob: "10-05-2009",
//   parentNumber: "9876500000",
//   examName: "Mid Term Examination",
//   address: "456, Sector 12, Delhi",
//   photo: "https://placehold.co/130x150?text=Photo",
//   qr: "https://placehold.co/90x90?text=QR",
//   principalSignature: "https://placehold.co/250x70?text=Signature",
//   date: "18-10-2025",
//   totalMarks: "380",
//   allsubjecttotal: "500",
//   percentage: "76",
//   overallGrade: "B1",
//   status: "Pass",
//   marks: [
//     {
//       subjectName: "Mathematics",
//       periodic_test: 8,
//       note_book: 4,
//       subject_enrichment: 4,
//       practical_marks: 16,
//       theory_marks: 65,
//       obtained_marks: 72,
//       grade: "B1",
//     },
//     {
//       subjectName: "Science",
//       periodic_test: 9,
//       note_book: 5,
//       subject_enrichment: 5,
//       practical_marks: 18,
//       theory_marks: 70,
//       obtained_marks: 78,
//       grade: "B1",
//     },
//     {
//       subjectName: "English",
//       periodic_test: 10,
//       note_book: 5,
//       subject_enrichment: 4,
//       practical_marks: 19,
//       theory_marks: 72,
//       obtained_marks: 80,
//       grade: "A2",
//     },
//   ],
//   activity: [
//     { subjectName: "Art Education", grade: "A" },
//     { subjectName: "Health & Physical Education", grade: "B" },
//   ],
//   skills: [
//     { subjectName: "Work Education", grade: "A" },
//     { subjectName: "Visual Arts", grade: "B" },
//   ],
// };

// const dummyTerm1 = { ...dummySingle, examName: "Term I" };
// const dummyTerm2 = { ...dummySingle, examName: "Term II", date: "20-03-2026" };


// const marksheetDesignSets = [
//   {
//     id: "set_1",
//     label: "Design 1",

//     midTerm: {
//       id: "temp_1mid",
//       label: "Mid Term",
//       html: createMarksheetPdf(dummySingle),
//     },

//     annualTerm: {
//       id: "temp_1annual",
//       label: "Annual Term",
//       html: createCombinedMarksheetPdf(dummyTerm1, dummyTerm2),
//     },
//   },

//   // Future mein Design 2 add karne ke liye:
//   // {
//   //   id: "set_2",
//   //   label: "Design 2",
//   //
//   //   midTerm: {
//   //     id: "temp_2mid",
//   //     label: "Mid Term",
//   //     html: createMyNewMidTermPdf(dummySingle),
//   //   },
//   //
//   //   annualTerm: {
//   //     id: "temp_2annual",
//   //     label: "Annual Term",
//   //     html: createMyNewAnnualPdf(dummyTerm1, dummyTerm2),
//   //   },
//   // },
// ];

// // ─────────────────────────────────────────────────────────────────────────────
// // SCALED IFRAME PREVIEW
// // ─────────────────────────────────────────────────────────────────────────────

// const MarksheetPreview = ({
//   html,
//   label,
// }: {
//   html: string;
//   label: string;
// }) => {
//   // A4 = 794 × 1123 px. We render at that size then scale down.
//   const SCALE = 0.29;
//   const A4_W = 794;
//   const A4_H = 1123;
//   const containerH = Math.round(A4_H * SCALE); // ≈ 325px

//   return (
//     <Box style={{ flex: 1, minWidth: 0 }}>
//       {/* Label pill */}
//       <Box
//         style={{
//           background: "var(--mantine-color-gray-1)",
//           borderBottom: "1px solid var(--mantine-color-gray-3)",
//           padding: "4px 10px",
//           textAlign: "center",
//         }}
//       >
//         <Text size="xs" fw={600} c="dimmed" tt="uppercase" style={{ letterSpacing: 1 }}>
//           {label}
//         </Text>
//       </Box>

//       {/* Preview window */}
//       <Box
//         style={{
//           width: "100%",
//           height: containerH,
//           overflow: "hidden",
//           background: "#f4f4f4",
//           position: "relative",
//         }}
//       >
//         <iframe
//           title={label}
//           srcDoc={html}
//           sandbox="allow-same-origin"
//           scrolling="no"
//           style={{
//             width: A4_W,
//             height: A4_H,
//             border: "none",
//             transformOrigin: "top left",
//             transform: `scale(${SCALE})`,
//             pointerEvents: "none",
//             background: "#fff",
//           }}
//         />
//       </Box>
//     </Box>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // MAIN COMPONENT
// // ─────────────────────────────────────────────────────────────────────────────

// // export const SelectMarksheet = () => {
// export const SelectMarksheet = ({
//   instituteId,
// }: {
//   instituteId: string;
// }) => {
 
// const [selectedMidTerm, setSelectedMidTerm] = useState<string>("");
// const [selectedAnnualTerm, setSelectedAnnualTerm] = useState<string>("");
//   const [saved, setSaved] = useState(false);


// const [saving, setSaving] = useState(false);
// const [error, setError] = useState("");
// useEffect(() => {
//   if (!instituteId) return;

//   GetMarksheetDesign(instituteId)
//     .then((response: any) => {
//       const data = response?.data ?? response;
//       const selection = data?.selection;

//       setSelectedMidTerm(selection?.midTermDesignId ?? "");
//       setSelectedAnnualTerm(selection?.annualTermDesignId ?? "");
//     })
//     .catch((error: any) => {
//       console.error(
//         "GET Marksheet Design Error:",
//         error?.response?.data ?? error?.message ?? error,
//       );
//     });
// }, [instituteId]);

// const handleSave = async () => {
//   if (
//     !instituteId ||
//     !selectedMidTerm ||
//     !selectedAnnualTerm ||
//     saving
//   ) {
//     return;
//   }

//   try {
//     setSaving(true);
//     setError("");
//     setSaved(false);

//     const response: any = await SaveMarksheetDesign(
//       instituteId,
//       selectedMidTerm,
//       selectedAnnualTerm,
//     );

//     const data = response?.data ?? response;
//     const selection = data?.selection;

//     if (
//       selection?.midTermDesignId !== selectedMidTerm ||
//       selection?.annualTermDesignId !== selectedAnnualTerm
//     ) {
//       throw new Error(data?.message || "Design save nahi hui.");
//     }

//     setSaved(true);
//   } catch (err: any) {
//     setError(
//       err?.response?.data?.message ||
//         err?.message ||
//         "Design save karne mein error aaya.",
//     );
//   } finally {
//     setSaving(false);
//   }
// };
//   return (
//  <Box p={{ base: "md", sm: "xl" }}>
//     <Stack gap={4} mb="xl">
//       <Title order={2} fw={700}>
//         Select Marksheet Design
//       </Title>

//       <Text c="dimmed" size="sm">
//         Mid Term aur Annual Term ke designs alag-alag select
//         karke Save Both Designs par click karein.
//       </Text>
//     </Stack>

//     <SimpleGrid
//       cols={{ base: 1, md: marksheetDesignSets.length > 1 ? 2 : 1 }}
//       spacing="xl"
//     >
//       {marksheetDesignSets.map((set) => {
//         // const isMidSelected = selectedMidTerm === set.id;
//         // const isAnnualSelected = selectedAnnualTerm === set.id;
// const isMidSelected = selectedMidTerm === set.midTerm.id;
// const isAnnualSelected = selectedAnnualTerm === set.annualTerm.id;
//         return (
//           <Card
//             key={set.id}
//             withBorder
//             radius="md"
//             p={0}
//             style={{
//               outline:
//                 isMidSelected || isAnnualSelected
//                   ? "2px solid var(--mantine-color-blue-6)"
//                   : "2px solid transparent",
//               boxShadow:
//                 isMidSelected || isAnnualSelected
//                   ? "0 0 0 3px rgba(66,133,244,0.10)"
//                   : "0 1px 4px rgba(0,0,0,0.06)",
//               transition: "outline 0.15s ease, box-shadow 0.15s ease",
//             }}
//           >
//             {/* Card Header */}
//             <Group
//               justify="space-between"
//               align="center"
//               mb="sm"
//             >
//               <Text fw={700} size="sm">
//                 {set.label}
//               </Text>

//               {(isMidSelected || isAnnualSelected) && (
//                 <Badge
//                   color="blue"
//                   variant="light"
//                   leftSection={<IconCheck size={12} />}
//                 >
//                   Selected
//                 </Badge>
//               )}
//             </Group>

//             {/* Mid Term and Annual Term Preview */}
//             <Box
//               style={{
//                 display: "flex",
//                 border: "1px solid var(--mantine-color-gray-3)",
//                 borderRadius: 6,
//                 overflow: "hidden",
//               }}
//             >
//               <MarksheetPreview
//                 html={set.midTerm.html}
//                 label={set.midTerm.label}
//               />

//               <Box
//                 style={{
//                   width: 1,
//                   background: "var(--mantine-color-gray-3)",
//                   flexShrink: 0,
//                 }}
//               />

//               <MarksheetPreview
//                 html={set.annualTerm.html}
//                 label={set.annualTerm.label}
//               />
//             </Box>

//             {/* Separate Selection Buttons */}
//             <Stack gap="sm" mt="md">
//               <Group justify="space-between" align="center">
//                 <Text size="sm" fw={500}>
//                   Mid Term Design
//                 </Text>

//                 <Button
//                   size="xs"
//                   variant={isMidSelected ? "filled" : "light"}
//                   color={isMidSelected ? "blue" : "gray"}
//                   onClick={() => {
//                     // setSelectedMidTerm(set.id);
//                      setSelectedMidTerm(set.midTerm.id);
                    

//                     setSaved(false);
//                     setError("");
//                   }}
//                 >
//                   {isMidSelected ? "Selected" : "Select Mid Term"}
//                 </Button>
//               </Group>

//               <Group justify="space-between" align="center">
//                 <Text size="sm" fw={500}>
//                   Annual Term Design
//                 </Text>

//                 <Button
//                   size="xs"
//                   variant={isAnnualSelected ? "filled" : "light"}
//                   color={isAnnualSelected ? "blue" : "gray"}
//                   onClick={() => {
//                     // setSelectedAnnualTerm(set.id);
//                       setSelectedAnnualTerm(set.annualTerm.id);
//                     setSaved(false);
//                     setError("");
//                   }}
//                 >
//                   {isAnnualSelected
//                     ? "Selected"
//                     : "Select Annual Term"}
//                 </Button>
//               </Group>
//             </Stack>
//           </Card>
//         );
//       })}
//     </SimpleGrid>

//     {/* Current Selections */}
//     <Box
//       mt="xl"
//       p="md"
//       style={{
//         border: "1px solid var(--mantine-color-gray-3)",
//         borderRadius: 8,
//       }}
//     >
//       <Text size="sm">
//         Mid Term:{" "}
//         <Text component="span" fw={700}>
//           {marksheetDesignSets.find(
//             (set) => set.id === selectedMidTerm,
//           )?.label ?? "Not selected"}
//         </Text>
//       </Text>

//       <Text size="sm" mt={4}>
//         Annual Term:{" "}
//         <Text component="span" fw={700}>
//           {marksheetDesignSets.find(
//             (set) => set.id === selectedAnnualTerm,
//           )?.label ?? "Not selected"}
//         </Text>
//       </Text>
//     </Box>

//     {error && (
//       <Text c="red" size="sm" mt="md">
//         {error}
//       </Text>
//     )}

//     <Group justify="flex-end" mt="xl">
//       <Button
//         size="md"
//         leftSection={<IconDeviceFloppy size={18} />}
//         disabled={
//           !selectedMidTerm ||
//           !selectedAnnualTerm ||
//           saving ||
//           !instituteId
//         }
//         loading={saving}
//         color={saved ? "green" : "blue"}
//         onClick={handleSave}
//       >
//         {saved ? "Saved!" : "Save Both Designs"}
//       </Button>
//     </Group>
//   </Box>

//   );
// };

// export default SelectMarksheet;


"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Group,
  Text,
  Badge,
  SimpleGrid,
  Card,
  Stack,
  Title,
  Divider,
  Paper,
  ThemeIcon,
  rem,
} from "@mantine/core";
import {
  IconCheck,
  IconDeviceFloppy,
  IconLayoutCards,
  IconCircleCheck,
  IconAlertCircle,
  IconArrowLeft,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createMarksheetPdf,
  createCombinedMarksheetPdf,
} from "./CreateMarksheetPdf";
import {
  GetMarksheetDesign,
  SaveMarksheetDesign,
} from "@/axios/institute/InstitutePostApi";
import { generateAnnualMarksheet1, generateMidTermMarksheet1 } from "./CreateMarksheetPdf1";
import { generateAnnualMarksheet2, generateMidTermMarksheet2 } from "./CreateMarksheetPdf2";
import { generateAnnualMarksheet3, generateMidTermMarksheet3 } from "./CreateMarksheetPdf3";
import { useRouter } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// DUMMY DATA  (only for preview)
// ─────────────────────────────────────────────────────────────────────────────

const dummySingle = {
  instituteLogo: "https://placehold.co/90x90?text=LOGO",
  instituteName: "Delhi Public School",
  instituteAdress: "123, Main Road, New Delhi - 110001",
  institutePhone: "9876543210",
  batchName: "10th",
  section: "A",
  session: "2024-25",
  studentName: "Rahul Sharma",
  rollNumber: "101",
  fName: "Rajesh Sharma",
  enrolment: "DPS-2024-101",
  dob: "10-05-2009",
  parentNumber: "9876500000",
  examName: "Mid Term Examination",
  address: "456, Sector 12, Delhi",
  photo: "https://placehold.co/130x150?text=Photo",
  qr: "https://placehold.co/90x90?text=QR",
  principalSignature: "https://placehold.co/250x70?text=Signature",
  date: "18-10-2025",
  totalMarks: "380",
  allsubjecttotal: "500",
  percentage: "76",
  overallGrade: "B1",
  status: "Pass",
  marks: [
    {
      subjectName: "Mathematics",
      periodic_test: 8,
      note_book: 4,
      subject_enrichment: 4,
      practical_marks: 16,
      theory_marks: 65,
      obtained_marks: 72,
      grade: "B1",
    },
    {
      subjectName: "Science",
      periodic_test: 9,
      note_book: 5,
      subject_enrichment: 5,
      practical_marks: 18,
      theory_marks: 70,
      obtained_marks: 78,
      grade: "B1",
    },
    {
      subjectName: "English",
      periodic_test: 10,
      note_book: 5,
      subject_enrichment: 4,
      practical_marks: 19,
      theory_marks: 72,
      obtained_marks: 80,
      grade: "A2",
    },
  ],
  activity: [
    { subjectName: "Art Education", grade: "A" },
    { subjectName: "Health & Physical Education", grade: "B" },
  ],
  skills: [
    { subjectName: "Work Education", grade: "A" },
    { subjectName: "Visual Arts", grade: "B" },
  ],
};

const dummyTerm1 = { ...dummySingle, examName: "Term I" };
const dummyTerm2 = { ...dummySingle, examName: "Term II", date: "20-03-2026" };

const marksheetDesignSets = [
  {
    id: "set_1",
    label: "Design 1",
    description: "Classic layout with detailed subject breakdown",
    midTerm: {
      id: "temp_1mid",
      label: "Mid Term",
      html: createMarksheetPdf(dummySingle),
    },
    annualTerm: {
      id: "temp_1annual",
      label: "Annual Term",
      html: createCombinedMarksheetPdf(dummyTerm1, dummyTerm2),
    },
  },
  // Add more designs here:
  {
    id: "set_2",
    label: "Design 2",
    description: "Modern minimal layout",
    midTerm: { id: "temp_2mid", label: "Mid Term", html: generateMidTermMarksheet1(dummySingle) },
    annualTerm: { id: "temp_2annual", label: "Annual Term", html: generateAnnualMarksheet1(dummyTerm1, dummyTerm2) },
  },
    {
    id: "set_3",
    label: "Design 3",
    description: "A sleek, modern design with elegant simplicity",
    midTerm: { id: "temp_3mid", label: "Mid Term", html: generateMidTermMarksheet2(dummySingle) },
    annualTerm: { id: "temp_3annual", label: "Annual Term", html: generateAnnualMarksheet2(dummyTerm1, dummyTerm2) },
  },
    {
    id: "set_4",
    label: "Design 4",
    description: "A refined layout with a modern edge",
    midTerm: { id: "temp_4mid", label: "Mid Term", html: generateMidTermMarksheet3(dummySingle) },
    annualTerm: { id: "temp_4annual", label: "Annual Term", html: generateAnnualMarksheet3(dummyTerm1, dummyTerm2) },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SCALED IFRAME PREVIEW
// ─────────────────────────────────────────────────────────────────────────────

const MarksheetPreview = ({
  html,
  label,
  isSelected,
}: {
  html: string;
  label: string;
  isSelected: boolean;
}) => {
  const SCALE = 0.28;
  const A4_W = 794;
  const A4_H = 1123;
  const containerH = Math.round(A4_H * SCALE);

  return (
    <Box style={{ flex: 1, minWidth: 0, position: "relative" }}>
      {/* Label */}
      <Box
        style={{
          background: isSelected ? "#EEF2FF" : "#F8FAFC",
          borderBottom: `1px solid ${isSelected ? "#C7D2FE" : "#E2E8F0"}`,
          padding: "6px 12px",
          textAlign: "center",
          transition: "background 0.2s ease",
        }}
      >
        <Text
          size="xs"
          fw={700}
          style={{
            color: isSelected ? "#4F46E5" : "#94A3B8",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </Text>
      </Box>

      {/* Iframe preview */}
      <Box
        style={{
          width: "100%",
          height: containerH,
          overflow: "hidden",
          background: "#F1F5F9",
          position: "relative",
        }}
      >
        <iframe
          title={label}
          srcDoc={html}
          sandbox="allow-same-origin"
          scrolling="no"
          style={{
            width: A4_W,
            height: A4_H,
            border: "none",
            transformOrigin: "top left",
            transform: `scale(${SCALE})`,
            pointerEvents: "none",
            background: "#fff",
          }}
        />
      </Box>

      {/* Selected overlay check */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "#4F46E5",
              borderRadius: "50%",
              width: 22,
              height: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(79,70,229,0.4)",
              zIndex: 2,
            }}
          >
            <IconCheck size={13} color="#fff" stroke={3} />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SELECTION PILL BUTTON
// ─────────────────────────────────────────────────────────────────────────────

const SelectPill = ({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.96 }}
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 350, damping: 20 }}
    style={{
      cursor: "pointer",
      border: selected ? "2px solid #4F46E5" : "2px solid #E2E8F0",
      background: selected ? "#EEF2FF" : "#fff",
      borderRadius: 999,
      padding: "5px 16px",
      fontSize: 13,
      fontWeight: 600,
      color: selected ? "#4F46E5" : "#64748B",
      display: "flex",
      alignItems: "center",
      gap: 6,
      transition: "all 0.18s ease",
      boxShadow: selected ? "0 0 0 3px rgba(79,70,229,0.12)" : "none",
    }}
  >
    <AnimatePresence mode="wait">
      {selected ? (
        <motion.span
          key="check"
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -4 }}
          transition={{ duration: 0.15 }}
          style={{ display: "flex" }}
        >
          <IconCircleCheck size={14} />
        </motion.span>
      ) : null}
    </AnimatePresence>
    {selected ? `Selected` : `Select ${label}`}
  </motion.button>
);

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN CARD
// ─────────────────────────────────────────────────────────────────────────────

const DesignCard = ({
  set,
  isMidSelected,
  isAnnualSelected,
  onSelectMid,
  onSelectAnnual,
}: {
  set: (typeof marksheetDesignSets)[number];
  isMidSelected: boolean;
  isAnnualSelected: boolean;
  onSelectMid: () => void;
  onSelectAnnual: () => void;
}) => {
  const isAnySelected = isMidSelected || isAnnualSelected;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Box
        style={{
          borderRadius: 16,
          overflow: "hidden",
          border: `2px solid ${isAnySelected ? "#4F46E5" : "#E2E8F0"}`,
          boxShadow: isAnySelected
            ? "0 4px 24px rgba(79,70,229,0.12)"
            : "0 2px 8px rgba(0,0,0,0.05)",
          background: "#fff",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        {/* ── Card top bar ── */}
        <Box
          style={{
            background: isAnySelected
              ? "linear-gradient(90deg,#EEF2FF 0%,#F0F9FF 100%)"
              : "#FAFAFA",
            borderBottom: `1px solid ${isAnySelected ? "#C7D2FE" : "#F1F5F9"}`,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "background 0.2s ease",
          }}
        >
          <Group gap={8} align="center">
            <ThemeIcon
              size={28}
              radius="md"
              color={isAnySelected ? "indigo" : "gray"}
              variant="light"
            >
              <IconLayoutCards size={15} />
            </ThemeIcon>

            <Box>
              <Text fw={700} size="sm" c={isAnySelected ? "indigo" : "dark"}>
                {set.label}
              </Text>
              {set.description && (
                <Text size="xs" c="dimmed" lh={1.3}>
                  {set.description}
                </Text>
              )}
            </Box>
          </Group>

          <AnimatePresence>
            {isAnySelected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Badge
                  color="indigo"
                  variant="light"
                  radius="xl"
                  size="sm"
                  leftSection={<IconCheck size={10} />}
                >
                  {isMidSelected && isAnnualSelected
                    ? "Both Selected"
                    : isMidSelected
                      ? "Mid Selected"
                      : "Annual Selected"}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* ── Previews ── */}
        <Box
          style={{
            display: "flex",
            borderBottom: "1px solid #F1F5F9",
          }}
        >
          <MarksheetPreview
            html={set.midTerm.html}
            label={set.midTerm.label}
            isSelected={isMidSelected}
          />

          <Box
            style={{
              width: 1,
              background: "#E2E8F0",
              flexShrink: 0,
            }}
          />

          <MarksheetPreview
            html={set.annualTerm.html}
            label={set.annualTerm.label}
            isSelected={isAnnualSelected}
          />
        </Box>

        {/* ── Selection controls ── */}
        <Box style={{ padding: "14px 16px", background: "#FAFAFA" }}>
          <SimpleGrid cols={2} spacing="sm">
            {/* Mid Term */}
            <Box
              style={{
                background: isMidSelected ? "#EEF2FF" : "#fff",
                border: `1px solid ${isMidSelected ? "#C7D2FE" : "#E2E8F0"}`,
                borderRadius: 12,
                padding: "10px 12px",
                transition: "all 0.2s ease",
              }}
            >
              <Text size="xs" c="dimmed" fw={600} mb={8} tt="uppercase" style={{ letterSpacing: "0.06em" }}>
                Mid Term
              </Text>
              <SelectPill
                label="Mid Term"
                selected={isMidSelected}
                onClick={onSelectMid}
              />
            </Box>

            {/* Annual Term */}
            <Box
              style={{
                background: isAnnualSelected ? "#EEF2FF" : "#fff",
                border: `1px solid ${isAnnualSelected ? "#C7D2FE" : "#E2E8F0"}`,
                borderRadius: 12,
                padding: "10px 12px",
                transition: "all 0.2s ease",
              }}
            >
              <Text size="xs" c="dimmed" fw={600} mb={8} tt="uppercase" style={{ letterSpacing: "0.06em" }}>
                Annual Term
              </Text>
              <SelectPill
                label="Annual Term"
                selected={isAnnualSelected}
                onClick={onSelectAnnual}
              />
            </Box>
          </SimpleGrid>
        </Box>
      </Box>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY BAR
// ─────────────────────────────────────────────────────────────────────────────

const SummaryBar = ({
  midLabel,
  annualLabel,
}: {
  midLabel: string;
  annualLabel: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.1 }}
  >
    <Paper
      radius="lg"
      p="md"
      style={{
        background: "linear-gradient(135deg,#F8FAFF 0%,#F0F9FF 100%)",
        border: "1px solid #E0E7FF",
      }}
    >
      <Group justify="space-between" wrap="wrap" gap="sm">
        <Group gap={6} align="center">
          <Box
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: midLabel !== "Not selected" ? "#4F46E5" : "#CBD5E1",
              flexShrink: 0,
            }}
          />
          <Text size="sm" c="dimmed">
            Mid Term:
          </Text>
          <Text size="sm" fw={700} c={midLabel !== "Not selected" ? "indigo" : "dimmed"}>
            {midLabel}
          </Text>
        </Group>

        <Divider orientation="vertical" style={{ height: 16, alignSelf: "center" }} />

        <Group gap={6} align="center">
          <Box
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: annualLabel !== "Not selected" ? "#4F46E5" : "#CBD5E1",
              flexShrink: 0,
            }}
          />
          <Text size="sm" c="dimmed">
            Annual Term:
          </Text>
          <Text size="sm" fw={700} c={annualLabel !== "Not selected" ? "indigo" : "dimmed"}>
            {annualLabel}
          </Text>
        </Group>
      </Group>
    </Paper>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const SelectMarksheet = ({ instituteId }: { instituteId: string }) => {
  const [selectedMidTerm, setSelectedMidTerm] = useState<string>("");
  const [selectedAnnualTerm, setSelectedAnnualTerm] = useState<string>("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!instituteId) return;

    GetMarksheetDesign(instituteId)
      .then((response: any) => {
        const data = response?.data ?? response;
        const selection = data?.selection;
        setSelectedMidTerm(selection?.midTermDesignId ?? "");
        setSelectedAnnualTerm(selection?.annualTermDesignId ?? "");
      })
      .catch((err: any) => {
        console.error(
          "GET Marksheet Design Error:",
          err?.response?.data ?? err?.message ?? err,
        );
      });
  }, [instituteId]);

  const handleSave = async () => {
    if (!instituteId || !selectedMidTerm || !selectedAnnualTerm || saving)
      return;

    try {
      setSaving(true);
      setError("");
      setSaved(false);

      const response: any = await SaveMarksheetDesign(
        instituteId,
        selectedMidTerm,
        selectedAnnualTerm,
      );

      const data = response?.data ?? response;
      const selection = data?.selection;

      if (
        selection?.midTermDesignId !== selectedMidTerm ||
        selection?.annualTermDesignId !== selectedAnnualTerm
      ) {
        throw new Error(data?.message || "Design save nahi hui.");
      }

      setSaved(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Design save karne mein error aaya.",
      );
    } finally {
      setSaving(false);
    }
  };

  // Resolve human-readable labels for summary bar
  const midLabel =
    marksheetDesignSets.find((s) => s.midTerm.id === selectedMidTerm)?.label ??
    "Not selected";

  const annualLabel =
    marksheetDesignSets.find((s) => s.annualTerm.id === selectedAnnualTerm)
      ?.label ?? "Not selected";

  const bothSelected = !!selectedMidTerm && !!selectedAnnualTerm;

  return (
    <Box
      p={{ base: "md", sm: "xl" }}
      style={{ maxWidth: 1100, margin: "0 auto" }}
    >
      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
                   <Button
    variant="light"
    color="gray"
    radius="md"
    leftSection={<IconArrowLeft size={18} />}
    onClick={() => router.back()}
  >
    Back
  </Button>
        <Stack gap={4} mb="xl">

          <Group gap={10} align="center">
   
            <ThemeIcon size={36} radius="md" color="indigo" variant="light">
              <IconLayoutCards size={20} />
            </ThemeIcon>

            <Box>
              <Title order={2} fw={800} c="dark">
                Select Marksheet Design
              </Title>
              <Text c="dimmed" size="sm" mt={2}>
                Mid Term aur Annual Term ke liye alag-alag design select
                karein, phir Save karein.
              </Text>
            </Box>
          </Group>
        </Stack>
      </motion.div>

      {/* ── Design cards ── */}
      <SimpleGrid
        cols={{ base: 1, lg: marksheetDesignSets.length > 1 ? 2 : 1 }}
        spacing="xl"
        mb="xl"
      >
        {marksheetDesignSets.map((set) => {
          const isMidSelected = selectedMidTerm === set.midTerm.id;
          const isAnnualSelected = selectedAnnualTerm === set.annualTerm.id;

          return (
            <DesignCard
              key={set.id}
              set={set}
              isMidSelected={isMidSelected}
              isAnnualSelected={isAnnualSelected}
              onSelectMid={() => {
                setSelectedMidTerm(set.midTerm.id);
                setSaved(false);
                setError("");
              }}
              onSelectAnnual={() => {
                setSelectedAnnualTerm(set.annualTerm.id);
                setSaved(false);
                setError("");
              }}
            />
          );
        })}
      </SimpleGrid>

      {/* ── Summary bar ── */}
      <SummaryBar midLabel={midLabel} annualLabel={annualLabel} />

      {/* ── Error message ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <Group gap={6} mt="sm" align="center">
              <IconAlertCircle size={16} color="#E11D48" />
              <Text c="red" size="sm">
                {error}
              </Text>
            </Group>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Save button ── */}
      <Group justify="flex-end" mt="xl">
        <motion.div whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
          <Button
            size="md"
            radius="xl"
            px="xl"
            leftSection={
              saved ? (
                <IconCircleCheck size={18} />
              ) : (
                <IconDeviceFloppy size={18} />
              )
            }
            disabled={!bothSelected || saving || !instituteId}
            loading={saving}
            color={saved ? "teal" : "indigo"}
            variant={saved ? "light" : "filled"}
            style={{
              fontWeight: 700,
              boxShadow: bothSelected
                ? "0 4px 16px rgba(79,70,229,0.25)"
                : "none",
              transition: "all 0.2s ease",
            }}
            onClick={handleSave}
          >
            {saved ? "Saved Successfully!" : "Save Both Designs"}
          </Button>
        </motion.div>
      </Group>
    </Box>
  );
};

export default SelectMarksheet;