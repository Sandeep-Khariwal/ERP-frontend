// // "use client";

// // import { GetTeacherById } from "@/axios/teacher/TeacherGetApi";
// // import {
// //   Box,
// //   Divider,
// //   Flex,
// //   LoadingOverlay,
// //   SimpleGrid,
// //   Stack,
// //   Tabs,
// //   TabsTab,
// //   Text,
// // } from "@mantine/core";
// // import { useMediaQuery } from "@mantine/hooks";
// // import { IconArrowLeft } from "@tabler/icons-react";
// // import React, { useEffect, useState } from "react";
// // import { Batch } from "../InstituteDashboard";
// // import { RiMoneyRupeeCircleLine } from "react-icons/ri";
// // import {
// //   InstituteBatchesSection,
// //   UserType,
// // } from "../../dashboard/InstituteBatchesSection";
// // import { InstituteInsideBatch } from "../insideBatch/InstituteInsideBatch";
// // import PayTeacherPayment from "./PayTeacherPayment";
// // import { SuccessNotification } from "@/app/helperFunction/Notification";
// // import { LogOut } from "@/axios/LocalStorageUtility";
// // import { AiOutlineLogout } from "react-icons/ai";
// // import { useAppDispatch } from "@/app/redux/redux.hooks";
// // import { useRouter } from "next/navigation";
// // import { saveToken } from "@/app/redux/slices/teacherSlice";
// // import { MdHistoryToggleOff } from "react-icons/md";
// // import SalaryCard from "../../teacher/TeacherSaleryCard";

// // interface Institute {
// //   _id: string;
// //   name: string;
// //   address: string;
// // }

// // interface Teacher {
// //   _id: string;
// //   name: string;
// //   email: string;
// //   phoneNumber: string[];
// //   profilePic: string;
// //   subjects: { _id: string; name: string }[];
// //   instituteBatches: any[];
// //   dateOfBirth: string;
// //   address: string;
// //   createdAt: string;
// //   dateOfJoining: string;
// //   instituteId: Institute;
// // }

// // const TeacherProfile = (props: {
// //   teacherId: string;
// //   onClickBack: () => void;
// //   userType: UserType;
// // }) => {
// //   const [isLoading, setIsLoading] = useState<boolean>(false);
// //   const isMd = useMediaQuery(`(max-width: 968px)`);
// //   const isLg = useMediaQuery(`(max-width: 1024px)`);
// //   const [selectedBatch, setSelectedBatch] = useState<Batch | null>();
// //   const [batchId, setBatchId] = useState<string | null>(null);
// //   const [selectedTab, setSelectedTab] = useState<string>("");
// //   const dispatch = useAppDispatch();
// //   const navigation = useRouter();
// //   const [teacher, setTeacher] = useState<Teacher>({
// //     _id: "",
// //     name: "John Doe",
// //     phoneNumber: ["+1 234 567 890", "+1 234 567 891"],
// //     email: "john@example.com",
// //     profilePic: "https://randomuser.me/api/portraits/men/1.jpg", // Sample URL for profile image
// //     subjects: [{ _id: "h kjfdhkj", name: "science" }],
// //     instituteBatches: [],
// //     dateOfBirth: "1985-07-15",
// //     address: "456 Teacher Lane, Education City, NY",
// //     createdAt: "2020-05-15T10:00:00Z",
// //     dateOfJoining: "2018-08-01T08:30:00Z",
// //     instituteId: {
// //       _id: "inst001",
// //       name: "Global Tech Academy",
// //       address: "123 Tech Street, Silicon Valley, CA",
// //     },
// //   });

// //   useEffect(() => {
// //     if (props.teacherId) {
// //       setIsLoading(true);
// //       GetTeacherById(props.teacherId)
// //         .then((x: any) => {
// //           const { teacher } = x;
// //           console.log("setTeacher :", teacher);

// //           setTeacher(teacher);
// //           setIsLoading(false);
// //         })
// //         .catch((e) => {
// //           console.log(e);
// //           setIsLoading(false);
// //         });
// //     }
// //   }, [props.teacherId]);

// //   return (
// //     <Stack
// //       w={UserType.OTHERS === props.userType ? "90%" : "90%"}
// //       // mx={"auto"}
// //       px={0}
// //       bg={"white"}
// //       mih={"100vh"}
// //       py={20}
// //       bgr={"20px"}
// //       style={{ borderRadius: "20px" }}
// //     >
// //       <LoadingOverlay visible={isLoading} />
// //       {UserType.OTHERS === props.userType && (
// //         <Flex w={"100%"} p={10} align={"center"} justify={"start"} gap={3}>
// //           <IconArrowLeft
// //             size={32}
// //             style={{ cursor: "pointer" }}
// //             onClick={() => props.onClickBack()}
// //           />
// //           <Text fw={500} style={{ fontFamily: "sans-serif" }}>
// //             Back
// //           </Text>
// //         </Flex>
// //       )}
// //       <Box
// //         h={"100%"}
// //         w={UserType.OTHERS === props.userType ? "100%" : "100%"}
// //         bg={"white"}
// //         style={{ margin: "0 auto", padding: "20px" }}
// //       >
// //         <Flex align="start" justify={"start"} gap="2rem" wrap="wrap">
// //           {/* Teacher Profile Picture */}
// //           <Box
// //             w={"10%"}
// //             style={{
// //               borderRadius: "50%",
// //               overflow: "hidden",
// //               flexShrink: 0,
// //               display: "flex",
// //               justifyContent: "center",
// //               alignItems: "center",
// //             }}
// //           >
// //             <img
// //               src={teacher?.profilePic || "/boyStudent.png"}
// //               alt={""}
// //               style={{ width: isMd ? "100%" : "70%", objectFit: "cover" }}
// //             />
// //             {/* Address and Institute Info */}
// //           </Box>

// //           {/* Teacher Details */}
// //           <Flex w={"25%"} direction="column" gap="sm" style={{ flexGrow: 1 }}>
// //             <Text fw={700} size="xl" c="blue">
// //               {teacher?.name}
// //             </Text>
// //             <Text size="sm" c="dimmed">
// //               {teacher?.instituteId.name}
// //             </Text>
// //             <Text size="sm" c="dimmed">
// //               Subjects: {teacher?.subjects.map((s) => s.name).join(", ")}
// //             </Text>
// //             {/* <Text size="sm" c="dimmed">
// //               Date of Birth:{" "}
// //               {teacher?.dateOfBirth
// //                 ? new Date(teacher?.dateOfBirth).toLocaleDateString()
// //                 : ""}
// //             </Text> */}
// //             <Text size="sm" c="dimmed">
// //               Email: {teacher?.email}
// //             </Text>
// //           </Flex>
// //           <Divider orientation="vertical" />
// //           <Flex w={"25%"} direction="column" gap="sm" style={{ flexGrow: 1 }}>
// //             <Text fw={500} size="lg">
// //               Other Information
// //             </Text>
// //             <Text size="sm" c="dimmed">
// //               Phone Number: {teacher?.phoneNumber.join(", ")}
// //             </Text>
// //             <Text size="sm" c="dimmed">
// //               Address: {teacher?.address}
// //             </Text>
// //             <Text size="sm" c="dimmed">
// //               Joined: {new Date(teacher?.dateOfJoining!!).toLocaleDateString()}
// //             </Text>
// //           </Flex>
// //           <Divider orientation="vertical" />
// //           <Flex w={"25%"} direction="column" gap="sm" style={{ flexGrow: 1 }}>
// //             <Text fw={500} size="lg">
// //               Institute Information
// //             </Text>
// //             <Text size="sm" c="dimmed">
// //               Institute: {teacher?.instituteId.name}
// //             </Text>
// //             <Text size="sm" c="dimmed">
// //               Address: {teacher?.instituteId.address}
// //             </Text>
// //           </Flex>
// //         </Flex>
// //       </Box>
// //       <Stack
// //         mih={"100vh"}
// //         bg={"white"}
// //         w={UserType.OTHERS === props.userType ? "100%" : "100%"}
// //         mx={"auto"}
// //         py={20}
// //       >
// //         <Tabs w={"objectFit"} style={{ padding: "0px" }} allowTabDeactivation>
// //           <Tabs.List>
// //             {UserType.OTHERS === props.userType && (
// //               <Tabs.Tab
// //                 value={"sallery"}
// //                 onClick={() => setSelectedTab("sallery")}
// //                 leftSection={<RiMoneyRupeeCircleLine size={16} />}
// //               >
// //                 Pay Sallery
// //               </Tabs.Tab>
// //             )}
// //             <Tabs.Tab
// //               value="history"
// //               leftSection={<MdHistoryToggleOff size={16} />}
// //             >
// //               History
// //             </Tabs.Tab>
// //           </Tabs.List>

// //           <Tabs.Panel value="sallery">
// //             <PayTeacherPayment
// //               teacherId={teacher._id}
// //               instituteId={teacher.instituteId._id}
// //               setSelectedTab={setSelectedTab}
// //             />
// //           </Tabs.Panel>

// //           <Tabs.Panel value="history">
// //             <Stack mt={10}>
// //               <SalaryCard teacherId={teacher._id} />
// //             </Stack>
// //           </Tabs.Panel>
// //         </Tabs>
// //         {batchId === null && (
// //           <Stack w={"100%"} h={"100%"} mx={"auto"} p={isMd ? 5 : 20}>
// //             <Flex
// //               w={"100%"}
// //               align={"center"}
// //               justify={"space-between"}
// //               gap={20}
// //             >
// //               <Text
// //                 fz={22}
// //                 fw={500}
// //                 c={"#36431F"}
// //                 style={{
// //                   whiteSpace: "nowrap",
// //                   maxWidth: "70%",
// //                   overflow: "hidden",
// //                   textOverflow: "ellipsis",
// //                   fontFamily: "Roboto",
// //                 }}
// //               >
// //                 All Batches
// //               </Text>

// //               {UserType.TEACHER === props.userType && (
// //                 <Flex
// //                   style={{ cursor: "pointer" }}
// //                   my={10}
// //                   align={"center"}
// //                   gap={10}
// //                 >
// //                   <AiOutlineLogout
// //                     size={20}
// //                     onClick={() => {
// //                       SuccessNotification("Log out!!");
// //                       LogOut();
// //                       dispatch(saveToken(""));
// //                       setTimeout(() => {
// //                         navigation.push("/");
// //                       }, 2000);
// //                     }}
// //                   />
// //                   <Text>Logout</Text>
// //                 </Flex>
// //               )}
// //             </Flex>

// //             {
// //               <SimpleGrid
// //                 cols={isMd ? 1 : isLg ? 2 : 4}
// //                 w={isMd ? "95%" : "100%"}
// //                 mx={"auto"}
// //                 spacing={20}
// //                 verticalSpacing={20}
// //               >
// //                 <InstituteBatchesSection
// //                   batches={teacher.instituteBatches.map((batch: any) => ({
// //                     id: batch?._id || "",
// //                     name: batch?.name || "",
// //                     subjects: batch?.subjects || [],
// //                     noOfTeachers: batch?.teachers.length || 0,
// //                     noOfStudents: batch?.students.length || 0,
// //                     firstThreeStudents: batch?.students.slice(0, 3) || [],
// //                     firstThreeTeachers: batch?.teachers.slice(0, 3) || [],
// //                   }))}
// //                   allBatches={teacher.instituteBatches.map((batch: any) => ({
// //                     id: batch?.id || "",
// //                     name: batch?.name || "",
// //                   }))}
// //                   userType={UserType.OTHERS}
// //                   setDeleteBatchId={(val: string) => {
// //                     //  setDeleteBatchId(val);
// //                     //  setBatchDeleteWarning(true);
// //                   }}
// //                   setDeleteModal={(val) => {}}
// //                   onEditBatchName={(id: string, val: string) => {
// //                     //  updateTheBatchName(id, val);
// //                   }}
// //                   onbatchCardClick={(val) => {
// //                     console.log("onbatchCardClick : ", val);

// //                     setBatchId(val.id);
// //                     setSelectedBatch(val);
// //                   }}
// //                   onEditCourseFees={(val: any) => {
// //                     //  setBatchId(val._id);
// //                     //  setOpenEditCourseFee(true);
// //                     // setisCourseFeesEdit(val);
// //                   }}
// //                   onAddBatchButtonClick={() => {
// //                     //  setOpenAddBatchModal(true);
// //                   }}
// //                   onEditBatchButtonClick={function (batchId: string): void {
// //                     //  setEditBatchDetails(true)
// //                     //  setOpenAddBatchModal(true)
// //                     //  editBatch(batchId)
// //                   }}
// //                   showAddBatch={false}
// //                 />
// //               </SimpleGrid>
// //             }
// //           </Stack>
// //         )}
// //         {batchId != null && (
// //           <Stack
// //             w={"100%"}
// //             h={"100%"}
// //             bg={"linear-gradient(135deg, #E6E1FF, #F7F5FF)"}
// //           >
// //             <InstituteInsideBatch
// //               batchId={batchId}
// //               batchName={selectedBatch?.name!!}
// //               instituteId={""}
// //               subjects={teacher.subjects}
// //               onClickBack={() => {
// //                 // getTechersBatches();
// //                 setBatchId(null);
// //               }}
// //               userType={props.userType}
// //               fromInstituteTeacherSection={true}
// //             />
// //           </Stack>
// //         )}
// //       </Stack>
// //     </Stack>
// //   );
// // };

// // export default TeacherProfile;

// "use client";

// import { GetTeacherById } from "@/axios/teacher/TeacherGetApi";
// import {
//   Box,
//   Flex,
//   LoadingOverlay,
//   SimpleGrid,
//   Stack,
//   Tabs,
//   Text,
// } from "@mantine/core";
// import { useMediaQuery } from "@mantine/hooks";
// import { IconArrowLeft } from "@tabler/icons-react";
// import React, { useEffect, useState } from "react";
// import { Batch } from "../InstituteDashboard";
// import { RiMoneyRupeeCircleLine } from "react-icons/ri";
// import {
//   InstituteBatchesSection,
//   UserType,
// } from "../../dashboard/InstituteBatchesSection";
// import { InstituteInsideBatch } from "../insideBatch/InstituteInsideBatch";
// import PayTeacherPayment from "./PayTeacherPayment";
// import { SuccessNotification } from "@/app/helperFunction/Notification";
// import { LogOut } from "@/axios/LocalStorageUtility";
// import { AiOutlineLogout } from "react-icons/ai";
// import { useAppDispatch } from "@/app/redux/redux.hooks";
// import { useRouter } from "next/navigation";
// import { saveToken } from "@/app/redux/slices/teacherSlice";
// import { MdHistoryToggleOff } from "react-icons/md";
// import SalaryCard from "../../teacher/TeacherSaleryCard";

// interface Institute {
//   _id: string;
//   name: string;
//   address: string;
// }

// interface Teacher {
//   _id: string;
//   name: string;
//   email: string;
//   phoneNumber: string[];
//   profilePic: string;
//   subjects: { _id: string; name: string }[];
//   instituteBatches: any[];
//   dateOfBirth: string;
//   address: string;
//   createdAt: string;
//   dateOfJoining: string;
//   instituteId: Institute;
// }

// const TeacherProfile = (props: {
//   teacherId: string;
//   onClickBack: () => void;
//   userType: UserType;
// }) => {
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const isMd = useMediaQuery(`(max-width: 968px)`);
//   const isLg = useMediaQuery(`(max-width: 1024px)`);
//   const [selectedBatch, setSelectedBatch] = useState<Batch | null>();
//   const [batchId, setBatchId] = useState<string | null>(null);
//   const [selectedTab, setSelectedTab] = useState<string>("");
//   const dispatch = useAppDispatch();
//   const navigation = useRouter();
//   const [teacher, setTeacher] = useState<Teacher>({
//     _id: "",
//     name: "John Doe",
//     phoneNumber: ["+1 234 567 890", "+1 234 567 891"],
//     email: "john@example.com",
//     profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
//     subjects: [{ _id: "h kjfdhkj", name: "science" }],
//     instituteBatches: [],
//     dateOfBirth: "1985-07-15",
//     address: "456 Teacher Lane, Education City, NY",
//     createdAt: "2020-05-15T10:00:00Z",
//     dateOfJoining: "2018-08-01T08:30:00Z",
//     instituteId: {
//       _id: "inst001",
//       name: "Global Tech Academy",
//       address: "123 Tech Street, Silicon Valley, CA",
//     },
//   });

//   useEffect(() => {
//     if (props.teacherId) {
//       setIsLoading(true);
//       GetTeacherById(props.teacherId)
//         .then((x: any) => {
//           const { teacher } = x;
//           setTeacher(teacher);
//           setIsLoading(false);
//         })
//         .catch((e) => {
//           console.log(e);
//           setIsLoading(false);
//         });
//     }
//   }, [props.teacherId]);

//   return (
//     <div style={{ width: "100%", minHeight: "100vh", background: "#F0F2F8", position: "relative" }}>
//       <LoadingOverlay visible={isLoading} />

//       {/* ───── HERO BANNER ───── */}
//       <div
//         style={{
//           background: "linear-gradient(135deg, #0A0F2C 0%, #1A2456 60%, #0D1B4B 100%)",
//           width: "100%",
//           padding: isMd ? "24px 16px 80px" : "32px 48px 90px",
//           position: "relative",
//           overflow: "hidden",
//         }}
//       >
//         {/* Decorative background circles */}
//         <div style={{
//           position: "absolute", top: -60, right: -60, width: 220, height: 220,
//           borderRadius: "50%", background: "rgba(245,200,66,0.07)", pointerEvents: "none"
//         }} />
//         <div style={{
//           position: "absolute", bottom: -40, left: "30%", width: 160, height: 160,
//           borderRadius: "50%", background: "rgba(245,200,66,0.05)", pointerEvents: "none"
//         }} />

//         {/* Back button */}
//         {UserType.OTHERS === props.userType && (
//           <button
//             onClick={() => props.onClickBack()}
//             style={{
//               display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)",
//               border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 16px",
//               cursor: "pointer", color: "#fff", fontSize: 14, fontWeight: 500,
//               backdropFilter: "blur(8px)", marginBottom: 28, width: "fit-content",
//               transition: "background 0.2s",
//             }}
//           >
//             <IconArrowLeft size={18} />
//             Back
//           </button>
//         )}

//         {/* Profile hero content */}
//         <div style={{
//           display: "flex", alignItems: isMd ? "center" : "flex-start",
//           flexDirection: isMd ? "column" : "row",
//           gap: isMd ? 20 : 32, textAlign: isMd ? "center" : "left",
//         }}>
//           {/* Avatar with gold ring */}
//           <div style={{ position: "relative", flexShrink: 0 }}>
//             <div style={{
//               width: isMd ? 96 : 114, height: isMd ? 96 : 114, borderRadius: "50%",
//               background: "linear-gradient(135deg, #F5C842, #E8A020)",
//               padding: 3, boxShadow: "0 0 0 4px rgba(245,200,66,0.2)",
//             }}>
//               <img
//                 src={teacher?.profilePic || "/boyStudent.png"}
//                 alt={teacher?.name}
//                 style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" }}
//               />
//             </div>
//             {/* Online dot */}
//             <div style={{
//               position: "absolute", bottom: 6, right: 6, width: 14, height: 14,
//               background: "#22C55E", borderRadius: "50%", border: "2px solid #0A0F2C",
//             }} />
//           </div>

//           {/* Name + meta */}
//           <div style={{ flex: 1 }}>
//             <div style={{
//               display: "inline-block", background: "rgba(245,200,66,0.15)",
//               border: "1px solid rgba(245,200,66,0.3)", borderRadius: 20,
//               padding: "3px 12px", fontSize: 11, color: "#F5C842",
//               letterSpacing: 1.2, fontWeight: 600, marginBottom: 10,
//             }}>
//               FACULTY
//             </div>
//             <div style={{ fontSize: isMd ? 26 : 34, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1, marginBottom: 6 }}>
//               {teacher?.name}
//             </div>
//             <div style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", marginBottom: 14 }}>
//               {teacher?.instituteId?.name}
//             </div>

//             {/* Subject pills */}
//             <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: isMd ? "center" : "flex-start" }}>
//               {teacher?.subjects?.map((s) => (
//                 <span key={s._id} style={{
//                   background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
//                   borderRadius: 20, padding: "4px 14px", fontSize: 12, color: "#fff", fontWeight: 500,
//                 }}>
//                   {s.name}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Logout button – Teacher only */}
//           {UserType.TEACHER === props.userType && (
//             <button
//               onClick={() => {
//                 SuccessNotification("Log out!!");
//                 LogOut();
//                 dispatch(saveToken(""));
//                 setTimeout(() => navigation.push("/"), 2000);
//               }}
//               style={{
//                 display: "flex", alignItems: "center", gap: 8,
//                 background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
//                 borderRadius: 10, padding: "10px 18px", cursor: "pointer",
//                 color: "#FCA5A5", fontSize: 14, fontWeight: 500, flexShrink: 0,
//               }}
//             >
//               <AiOutlineLogout size={18} />
//               Logout
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ───── INFO CARDS (floating over banner) ───── */}
//       <div style={{
//         display: "flex", flexWrap: "wrap", gap: 16,
//         padding: isMd ? "0 16px" : "0 48px",
//         marginTop: -48, marginBottom: 32, position: "relative", zIndex: 10,
//       }}>
//         {/* Regular info cards */}
//         {[
//           { label: "Email", value: teacher?.email, icon: "✉" },
//           { label: "Phone", value: teacher?.phoneNumber?.join(", "), icon: "📞" },
//           { label: "Address", value: teacher?.address, icon: "📍" },
//           {
//             label: "Date of Birth",
//             value: teacher?.dateOfBirth ? new Date(teacher.dateOfBirth).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—",
//             icon: "🎂",
//           },
//           {
//             label: "Joined",
//             value: teacher?.dateOfJoining ? new Date(teacher.dateOfJoining).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—",
//             icon: "🗓",
//           },
//           { label: "Institute", value: teacher?.instituteId?.name, icon: "🏫" },
//           { label: "Institute Address", value: teacher?.instituteId?.address, icon: "🏛" },
//         ].map((item) => (
//           <div key={item.label} style={{
//             background: "#FFFFFF", borderRadius: 16,
//             boxShadow: "0 8px 32px rgba(10,15,44,0.10)",
//             padding: "16px 20px", minWidth: 180, flex: "1 1 180px",
//             borderTop: "3px solid #F5C842",
//           }}>
//             <div style={{ fontSize: 11, color: "#8A92A6", fontWeight: 600, letterSpacing: 1, marginBottom: 4 }}>
//               {item.icon} {item.label.toUpperCase()}
//             </div>
//             <div style={{ fontSize: 13, color: "#1E293B", fontWeight: 600, wordBreak: "break-word" }}>
//               {item.value || "—"}
//             </div>
//           </div>
//         ))}

//         {/* Subjects card — full width, pills layout */}
//         <div style={{
//           background: "#FFFFFF", borderRadius: 16,
//           boxShadow: "0 8px 32px rgba(10,15,44,0.10)",
//           padding: "16px 20px", flex: "1 1 100%",
//           borderTop: "3px solid #F5C842",
//         }}>
//           <div style={{ fontSize: 11, color: "#8A92A6", fontWeight: 600, letterSpacing: 1, marginBottom: 10 }}>
//             📚 SUBJECTS TAUGHT
//           </div>
//           <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//             {teacher?.subjects?.length > 0 ? teacher.subjects.map((s) => (
//               <span key={s._id} style={{
//                 background: "linear-gradient(135deg, #0A0F2C, #1A2456)",
//                 color: "#F5C842", borderRadius: 20,
//                 padding: "6px 16px", fontSize: 13, fontWeight: 600,
//                 letterSpacing: 0.3,
//               }}>
//                 {s.name}
//               </span>
//             )) : (
//               <span style={{ fontSize: 13, color: "#8A92A6" }}>No subjects assigned</span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ───── TABS SECTION ───── */}
//       <div style={{
//         background: "#FFFFFF", borderRadius: 20, margin: isMd ? "0 12px 32px" : "0 48px 48px",
//         boxShadow: "0 4px 24px rgba(10,15,44,0.07)", overflow: "hidden",
//       }}>
//         <Tabs allowTabDeactivation styles={{
//           root: { width: "100%" },
//           list: {
//             background: "#F8F9FD", borderBottom: "1px solid #E8EAF0",
//             padding: "0 24px",
//           },
//           tab: {
//             fontSize: 13, fontWeight: 600, color: "#8A92A6", padding: "16px 20px",
//             borderBottom: "3px solid transparent",
//           },
//           panel: { padding: 0 },
//         }}>
//           <Tabs.List>
//             {UserType.OTHERS === props.userType && (
//               <Tabs.Tab
//                 value="sallery"
//                 onClick={() => setSelectedTab("sallery")}
//                 leftSection={<RiMoneyRupeeCircleLine size={15} />}
//               >
//                 Pay Salary
//               </Tabs.Tab>
//             )}
//             <Tabs.Tab
//               value="history"
//               leftSection={<MdHistoryToggleOff size={15} />}
//             >
//               History
//             </Tabs.Tab>
//           </Tabs.List>

//           <Tabs.Panel value="sallery">
//             <div style={{ padding: "24px" }}>
//               <PayTeacherPayment
//                 teacherId={teacher._id}
//                 instituteId={teacher.instituteId._id}
//                 setSelectedTab={setSelectedTab}
//               />
//             </div>
//           </Tabs.Panel>

//           <Tabs.Panel value="history">
//             <div style={{ padding: "24px" }}>
//               <SalaryCard teacherId={teacher._id} />
//             </div>
//           </Tabs.Panel>
//         </Tabs>
//       </div>

//       {/* ───── BATCHES SECTION ───── */}
//       {batchId === null && (
//         <div style={{
//           margin: isMd ? "0 12px 48px" : "0 48px 48px",
//         }}>
//           {/* Section header */}
//           <div style={{
//             display: "flex", alignItems: "center", justifyContent: "space-between",
//             marginBottom: 24,
//           }}>
//             <div>
//               <div style={{ fontSize: 11, color: "#8A92A6", fontWeight: 600, letterSpacing: 1.2, marginBottom: 4 }}>
//                 ENROLLED
//               </div>
//               <div style={{ fontSize: isMd ? 20 : 26, fontWeight: 800, color: "#0A0F2C" }}>
//                 All Batches
//               </div>
//             </div>
//             <div style={{
//               background: "linear-gradient(135deg, #0A0F2C, #1A2456)",
//               borderRadius: 12, padding: "8px 18px",
//               fontSize: 13, color: "#F5C842", fontWeight: 700,
//             }}>
//               {teacher.instituteBatches.length} Batches
//             </div>
//           </div>

//           <SimpleGrid
//             cols={isMd ? 1 : isLg ? 2 : 4}
//             spacing={20}
//             verticalSpacing={20}
//           >
//             <InstituteBatchesSection
//               batches={teacher.instituteBatches.map((batch: any) => ({
//                 id: batch?._id || "",
//                 name: batch?.name || "",
//                 subjects: batch?.subjects || [],
//                 noOfTeachers: batch?.teachers.length || 0,
//                 noOfStudents: batch?.students.length || 0,
//                 firstThreeStudents: batch?.students.slice(0, 3) || [],
//                 firstThreeTeachers: batch?.teachers.slice(0, 3) || [],
//               }))}
//               allBatches={teacher.instituteBatches.map((batch: any) => ({
//                 id: batch?.id || "",
//                 name: batch?.name || "",
//               }))}
//               userType={UserType.OTHERS}
//               setDeleteBatchId={(val: string) => {}}
//               setDeleteModal={(val) => {}}
//               onEditBatchName={(id: string, val: string) => {}}
//               onbatchCardClick={(val) => {
//                 setBatchId(val.id);
//                 setSelectedBatch(val);
//               }}
//               onEditCourseFees={(val: any) => {}}
//               onAddBatchButtonClick={() => {}}
//               onEditBatchButtonClick={function (batchId: string): void {}}
//               showAddBatch={false}
//             />
//           </SimpleGrid>
//         </div>
//       )}

//       {/* ───── INSIDE BATCH ───── */}
//       {batchId != null && (
//         <div style={{
//           margin: isMd ? "0 12px 48px" : "0 48px 48px",
//           background: "linear-gradient(135deg, #E6E1FF, #F7F5FF)",
//           borderRadius: 20, overflow: "hidden",
//         }}>
//           <InstituteInsideBatch
//             batchId={batchId}
//             batchName={selectedBatch?.name!!}
//             instituteId={""}
//             subjects={teacher.subjects}
//             onClickBack={() => setBatchId(null)}
//             userType={props.userType}
//             fromInstituteTeacherSection={true}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default TeacherProfile;

"use client";

import { GetTeacherById } from "@/axios/teacher/TeacherGetApi";
import {
  LoadingOverlay,
  SimpleGrid,
  Tabs,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconArrowLeft, IconEdit } from "@tabler/icons-react";  // ✅ IconEdit added
import React, { useEffect, useState } from "react";
import { Batch } from "../InstituteDashboard";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import {
  InstituteBatchesSection,
  UserType,
} from "../../dashboard/InstituteBatchesSection";
import { InstituteInsideBatch } from "../insideBatch/InstituteInsideBatch";
import PayTeacherPayment from "./PayTeacherPayment";
import { SuccessNotification } from "@/app/helperFunction/Notification";
import { LogOut } from "@/axios/LocalStorageUtility";
import { AiOutlineLogout } from "react-icons/ai";
import { useAppDispatch } from "@/app/redux/redux.hooks";
import { useRouter } from "next/navigation";
import { saveToken } from "@/app/redux/slices/teacherSlice";
import { MdHistoryToggleOff } from "react-icons/md";
import SalaryCard from "../../teacher/TeacherSaleryCard";
import ManageTeacherBatchesModal from "./ManageTeacherBatchesModal"; // ✅ NEW import

interface Institute {
  _id: string;
  name: string;
  address: string;
}

interface Teacher {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string[];
  profilePic: string;
  subjects: { _id: string; name: string }[];
  instituteBatches: any[];
  dateOfBirth: string;
  address: string;
  createdAt: string;
  dateOfJoining: string;
  instituteId: Institute;
}

const TeacherProfile = (props: {
  teacherId: string;
  onClickBack: () => void;
  userType: UserType;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const isLg = useMediaQuery(`(max-width: 1024px)`);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>();
  const [batchId, setBatchId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("");
  const dispatch = useAppDispatch();
  const navigation = useRouter();

  // ✅ NEW — modal state
  const [manageBatchesModal, setManageBatchesModal] = useState(false);

  const [teacher, setTeacher] = useState<Teacher>({
    _id: "",
    name: "John Doe",
    phoneNumber: ["+1 234 567 890", "+1 234 567 891"],
    email: "john@example.com",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
    subjects: [{ _id: "h kjfdhkj", name: "science" }],
    instituteBatches: [],
    dateOfBirth: "1985-07-15",
    address: "456 Teacher Lane, Education City, NY",
    createdAt: "2020-05-15T10:00:00Z",
    dateOfJoining: "2018-08-01T08:30:00Z",
    instituteId: {
      _id: "inst001",
      name: "Global Tech Academy",
      address: "123 Tech Street, Silicon Valley, CA",
    },
  });

  // ✅ Extracted into a function so modal can trigger a refresh too
  const fetchTeacher = () => {
    if (!props.teacherId) return;
    setIsLoading(true);
    GetTeacherById(props.teacherId)
      .then((x: any) => {
        setTeacher(x.teacher);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchTeacher();
  }, [props.teacherId]);

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#F0F2F8", position: "relative" }}>
      <LoadingOverlay visible={isLoading} />

      {/* ✅ NEW — Manage Batches Modal */}
      <ManageTeacherBatchesModal
        opened={manageBatchesModal}
        onClose={() => setManageBatchesModal(false)}
        teacherId={teacher._id}
        instituteId={teacher.instituteId._id}
        assignedBatches={teacher.instituteBatches.map((b: any) => ({
          _id: b._id,
          name: b.name,
        }))}
        onUpdate={fetchTeacher}
      />

      {/* ───── HERO BANNER ───── */}
      <div
        style={{
          background: "linear-gradient(135deg, #0A0F2C 0%, #1A2456 60%, #0D1B4B 100%)",
          width: "100%",
          padding: isMd ? "24px 16px 80px" : "32px 48px 90px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background circles */}
        <div style={{
          position: "absolute", top: -60, right: -60, width: 220, height: 220,
          borderRadius: "50%", background: "rgba(245,200,66,0.07)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -40, left: "30%", width: 160, height: 160,
          borderRadius: "50%", background: "rgba(245,200,66,0.05)", pointerEvents: "none",
        }} />

        {/* Back button */}
        {UserType.OTHERS === props.userType && (
          <button
            onClick={() => props.onClickBack()}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10,
              padding: "8px 16px", cursor: "pointer", color: "#fff",
              fontSize: 14, fontWeight: 500, backdropFilter: "blur(8px)",
              marginBottom: 28, width: "fit-content",
            }}
          >
            <IconArrowLeft size={18} />
            Back
          </button>
        )}

        {/* Profile hero content */}
        <div style={{
          display: "flex", alignItems: isMd ? "center" : "flex-start",
          flexDirection: isMd ? "column" : "row",
          gap: isMd ? 20 : 32, textAlign: isMd ? "center" : "left",
        }}>
          {/* Avatar */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{
              width: isMd ? 96 : 114, height: isMd ? 96 : 114, borderRadius: "50%",
              background: "linear-gradient(135deg, #F5C842, #E8A020)",
              padding: 3, boxShadow: "0 0 0 4px rgba(245,200,66,0.2)",
            }}>
              <img
                src={teacher?.profilePic || "/boyStudent.png"}
                alt={teacher?.name}
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" }}
              />
            </div>
            <div style={{
              position: "absolute", bottom: 6, right: 6, width: 14, height: 14,
              background: "#22C55E", borderRadius: "50%", border: "2px solid #0A0F2C",
            }} />
          </div>

          {/* Name + meta */}
          <div style={{ flex: 1 }}>
            <div style={{
              display: "inline-block", background: "rgba(245,200,66,0.15)",
              border: "1px solid rgba(245,200,66,0.3)", borderRadius: 20,
              padding: "3px 12px", fontSize: 11, color: "#F5C842",
              letterSpacing: 1.2, fontWeight: 600, marginBottom: 10,
            }}>
              FACULTY
            </div>
            <div style={{ fontSize: isMd ? 26 : 34, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1, marginBottom: 6 }}>
              {teacher?.name}
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", marginBottom: 14 }}>
              {teacher?.instituteId?.name}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: isMd ? "center" : "flex-start" }}>
              {teacher?.subjects?.map((s) => (
                <span key={s._id} style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 20, padding: "4px 14px",
                  fontSize: 12, color: "#fff", fontWeight: 500,
                }}>
                  {s.name}
                </span>
              ))}
            </div>
          </div>

          {/* Logout — Teacher only */}
          {UserType.TEACHER === props.userType && (
            <button
              onClick={() => {
                SuccessNotification("Log out!!");
                LogOut();
                dispatch(saveToken(""));
                setTimeout(() => navigation.push("/"), 2000);
              }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 10, padding: "10px 18px", cursor: "pointer",
                color: "#FCA5A5", fontSize: 14, fontWeight: 500, flexShrink: 0,
              }}
            >
              <AiOutlineLogout size={18} />
              Logout
            </button>
          )}
        </div>
      </div>

      {/* ───── INFO CARDS ───── */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 16,
        padding: isMd ? "0 16px" : "0 48px",
        marginTop: -48, marginBottom: 32, position: "relative", zIndex: 10,
      }}>
        {[
          { label: "Email", value: teacher?.email, icon: "✉" },
          { label: "Phone", value: teacher?.phoneNumber?.join(", "), icon: "📞" },
          { label: "Address", value: teacher?.address, icon: "📍" },
          {
            label: "Date of Birth",
            value: teacher?.dateOfBirth
              ? new Date(teacher.dateOfBirth).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
              : "—",
            icon: "🎂",
          },
          {
            label: "Joined",
            value: teacher?.dateOfJoining
              ? new Date(teacher.dateOfJoining).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
              : "—",
            icon: "🗓",
          },
          { label: "Institute", value: teacher?.instituteId?.name, icon: "🏫" },
          { label: "Institute Address", value: teacher?.instituteId?.address, icon: "🏛" },
        ].map((item) => (
          <div key={item.label} style={{
            background: "#FFFFFF", borderRadius: 16,
            boxShadow: "0 8px 32px rgba(10,15,44,0.10)",
            padding: "16px 20px", minWidth: 180, flex: "1 1 180px",
            borderTop: "3px solid #F5C842",
          }}>
            <div style={{ fontSize: 11, color: "#8A92A6", fontWeight: 600, letterSpacing: 1, marginBottom: 4 }}>
              {item.icon} {item.label.toUpperCase()}
            </div>
            <div style={{ fontSize: 13, color: "#1E293B", fontWeight: 600, wordBreak: "break-word" }}>
              {item.value || "—"}
            </div>
          </div>
        ))}

        <div style={{
          background: "#FFFFFF", borderRadius: 16,
          boxShadow: "0 8px 32px rgba(10,15,44,0.10)",
          padding: "16px 20px", flex: "1 1 100%",
          borderTop: "3px solid #F5C842",
        }}>
          <div style={{ fontSize: 11, color: "#8A92A6", fontWeight: 600, letterSpacing: 1, marginBottom: 10 }}>
            📚 SUBJECTS TAUGHT
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {teacher?.subjects?.length > 0 ? teacher.subjects.map((s) => (
              <span key={s._id} style={{
                background: "linear-gradient(135deg, #0A0F2C, #1A2456)",
                color: "#F5C842", borderRadius: 20,
                padding: "6px 16px", fontSize: 13, fontWeight: 600,
              }}>
                {s.name}
              </span>
            )) : (
              <span style={{ fontSize: 13, color: "#8A92A6" }}>No subjects assigned</span>
            )}
          </div>
        </div>
      </div>

      {/* ───── TABS SECTION ───── */}
      <div style={{
        background: "#FFFFFF", borderRadius: 20,
        margin: isMd ? "0 12px 32px" : "0 48px 32px",
        boxShadow: "0 4px 24px rgba(10,15,44,0.07)", overflow: "hidden",
      }}>
        <Tabs allowTabDeactivation styles={{
          root: { width: "100%" },
          list: { background: "#F8F9FD", borderBottom: "1px solid #E8EAF0", padding: "0 24px" },
          tab: { fontSize: 13, fontWeight: 600, color: "#8A92A6", padding: "16px 20px", borderBottom: "3px solid transparent" },
          panel: { padding: 0 },
        }}>
          <Tabs.List>
            {UserType.OTHERS === props.userType && (
              <Tabs.Tab value="sallery" onClick={() => setSelectedTab("sallery")} leftSection={<RiMoneyRupeeCircleLine size={15} />}>
                Pay Salary
              </Tabs.Tab>
            )}
            <Tabs.Tab value="history" leftSection={<MdHistoryToggleOff size={15} />}>
              History
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="sallery">
            <div style={{ padding: "24px" }}>
              <PayTeacherPayment teacherId={teacher._id} instituteId={teacher.instituteId._id} setSelectedTab={setSelectedTab} />
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="history">
            <div style={{ padding: "24px" }}>
              <SalaryCard teacherId={teacher._id} />
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>

      {/* ───── BATCHES SECTION ───── */}
      {batchId === null && (
        <div style={{ margin: isMd ? "0 12px 48px" : "0 48px 48px" }}>
          {/* Section header */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: 24,
          }}>
            <div>
              <div style={{ fontSize: 11, color: "#8A92A6", fontWeight: 600, letterSpacing: 1.2, marginBottom: 4 }}>
                ENROLLED
              </div>
              <div style={{ fontSize: isMd ? 20 : 26, fontWeight: 800, color: "#0A0F2C" }}>
                All Batches
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* ✅ NEW — Manage Batches button (OTHERS/admin only) */}
              {UserType.OTHERS === props.userType && (
                <button
                  onClick={() => setManageBatchesModal(true)}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    background: "linear-gradient(135deg, #F5C842, #E8A020)",
                    border: "none", borderRadius: 12,
                    padding: "9px 18px", cursor: "pointer",
                    color: "#0A0F2C", fontSize: 13, fontWeight: 700,
                    boxShadow: "0 4px 12px rgba(245,200,66,0.3)",
                  }}
                >
                  <IconEdit size={15} />
                  Manage Batches
                </button>
              )}

              {/* Batch count badge */}
              <div style={{
                background: "linear-gradient(135deg, #0A0F2C, #1A2456)",
                borderRadius: 12, padding: "8px 18px",
                fontSize: 13, color: "#F5C842", fontWeight: 700,
              }}>
                {teacher.instituteBatches.length} Batches
              </div>
            </div>
          </div>

          <SimpleGrid cols={isMd ? 1 : isLg ? 2 : 4} spacing={20} verticalSpacing={20}>
            <InstituteBatchesSection
              batches={teacher.instituteBatches.map((batch: any) => ({
                id: batch?._id || "",
                name: batch?.name || "",
                subjects: batch?.subjects || [],
                noOfTeachers: batch?.teachers.length || 0,
                noOfStudents: batch?.students.length || 0,
                firstThreeStudents: batch?.students.slice(0, 3) || [],
                firstThreeTeachers: batch?.teachers.slice(0, 3) || [],
              }))}
              allBatches={teacher.instituteBatches.map((batch: any) => ({
                id: batch?.id || "",
                name: batch?.name || "",
              }))}
              userType={UserType.OTHERS}
              setDeleteBatchId={(val: string) => {}}
              setDeleteModal={(val) => {}}
              onEditBatchName={(id: string, val: string) => {}}
              onbatchCardClick={(val) => {
                setBatchId(val.id);
                setSelectedBatch(val);
              }}
              onEditCourseFees={(val: any) => {}}
              onAddBatchButtonClick={() => {}}
              onEditBatchButtonClick={function (batchId: string): void {}}
              showAddBatch={false}
            />
          </SimpleGrid>
        </div>
      )}

      {/* ───── INSIDE BATCH ───── */}
      {batchId != null && (
        <div style={{
          margin: isMd ? "0 12px 48px" : "0 48px 48px",
          background: "linear-gradient(135deg, #E6E1FF, #F7F5FF)",
          borderRadius: 20, overflow: "hidden",
        }}>
          <InstituteInsideBatch
            batchId={batchId}
            batchName={selectedBatch?.name!!}
            instituteId={""}
            subjects={teacher.subjects}
            onClickBack={() => setBatchId(null)}
            userType={props.userType}
            fromInstituteTeacherSection={true}
          />
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;