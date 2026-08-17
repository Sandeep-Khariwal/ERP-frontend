// "use client";
// import React, {
//   useEffect,
//   useRef,useState,useCallback, useMemo,
// } from "react";
// import {
//   Box, Button, Group, Text, Badge, ActionIcon, Stack, TextInput, Avatar, ScrollArea, Tabs,
//   Divider,Modal,Tooltip,Loader, Center, Paper,
// } from "@mantine/core";
// import { useDisclosure } from "@mantine/hooks";
// import { notifications } from "@mantine/notifications";
// import {
//   IconMicrophone, IconMicrophoneOff,
//   IconVideo,
//   IconVideoOff,  IconScreenShare, IconScreenShareOff, IconPhoneOff, IconSend, IconMenu4, IconUsers,
//   IconMessage, IconHelpCircle, IconPlus,
//   IconX,
// } from "@tabler/icons-react";
// import { useParams, useRouter, useSearchParams } from "next/navigation";
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
// import {
//   ChatMessage,
//   Meeting,
//   Poll,
//   UserRole,
// } from "@/app/components/meeting/meeting.types";
// import { useMeetingSocket } from "@/app/components/meeting/useMeetingSocket";
// import {
//   EndMeeting,
//   GetMeeting,
//   StartMeeting,
// } from "@/axios/institute/MeetingApi";
// import {
//   ErrorNotification,
//   SuccessNotification,
// } from "@/app/helperFunction/Notification";

// dayjs.extend(relativeTime);

// const ROLE_COLORS: Record<UserRole, string> = {
//   teacher: "violet",
//   admin: "orange",
//   student: "blue",
// };

// export default function MeetingRoomPage() {
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const meetingId = params.id as string;

//   const role = (searchParams.get("role") || "student") as UserRole;
//   const userId = searchParams.get("userId") || "user_" + Date.now();
//   const userName = decodeURIComponent(searchParams.get("name") || "Unknown");
//   const isTeacher = role === "teacher" || role === "admin";

//   const [meeting, setMeeting] = useState<Meeting | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isVideoOff, setIsVideoOff] = useState(false);
//   const [isScreenSharing, setIsScreenSharing] = useState(false);
//   const [msgInput, setMsgInput] = useState("");
//   const [msgType, setMsgType] = useState<"text" | "question" | "answer">(
//     "text",
//   );
//   const [pollModalOpen, { open: openPoll, close: closePoll }] =
//     useDisclosure(false);
//   const [pollQuestion, setPollQuestion] = useState("");
//   const [pollOptions, setPollOptions] = useState(["", ""]);
//   const [elapsed, setElapsed] = useState(0);

//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const localStreamRef = useRef<MediaStream | null>(null);
//   const chatEndRef = useRef<HTMLDivElement>(null);
//   const screenStreamRef = useRef<MediaStream | null>(null);

//   const handleMeetingStarted = useCallback(() => {
//     notifications.show({
//       color: "green",
//       title: "Class Started!",
//       message: "The teacher has started the class.",
//     });
//     setMeeting((prev) => (prev ? { ...prev, status: "live" } : prev));
//   }, []);

//   const handleMeetingEnded = useCallback(() => {
//     notifications.show({
//       color: "orange",
//       title: "Class Ended",
//       message: "The teacher has ended the class.",
//     });
//     setTimeout(() => router.push("/meetings"), 3000);
//   }, [router]);

//   const {
//     isConnected,
//     messages = [],
//     participants = [],
//     polls = [],
//     sendMessage,
//     createPoll,
//     votePoll,
//     closePoll: closeActivePoll,
//     startMeeting: socketStart,
//     endMeetingSocket,
//   } = useMeetingSocket({
//     meetingId,
//     userId,
//     name: userName,
//     role,
//     onMeetingStarted: handleMeetingStarted,
//     onMeetingEnded: handleMeetingEnded,
//   });
//   const loadMeeting = useCallback(() => {
//     setLoading(true);
//     GetMeeting(meetingId)
//       .then((res: any) => {
//         setMeeting(res?.data || res);
//         setLoading(false);
//       })
//       .catch(() => {
//         ErrorNotification("Meeting Not Found");
//         setLoading(false);
//         router.push("/meetings");
//       });
//   }, [meetingId, router]);

//   useEffect(() => {
//     loadMeeting();
//   }, [loadMeeting]);

//   const handleStartMeeting = useCallback(() => {
//     socketStart();
//     StartMeeting(meetingId)
//       .then(() => {
//         SuccessNotification("Class Started Successfully");
//         setMeeting((prev) => (prev ? { ...prev, status: "live" } : prev));
//       })
//       .catch((err: any) => {
//         ErrorNotification(
//           err?.response?.data?.message || "Failed To Start Class",
//         );
//       });
//   }, [meetingId, socketStart]);

//   useEffect(() => {
//     if (meeting?.status !== "live") return;
//     const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
//     return () => clearInterval(timer);
//   }, [meeting?.status]);

//   const formatElapsed = (s: number) => {
//     const h = Math.floor(s / 3600);
//     const m = Math.floor((s % 3600) / 60);
//     const sec = s % 60;
//     return h > 0
//       ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
//       : `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
//   };

//   useEffect(() => {
//     const startCamera = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true,
//         });
//         localStreamRef.current = stream;
//         if (localVideoRef.current) localVideoRef.current.srcObject = stream;
//       } catch {
//         console.warn("Camera/Mic not available");
//       }
//     };
//     startCamera();
//     return () => {
//       localStreamRef.current?.getTracks().forEach((t) => t.stop());
//     };
//   }, []);

//   const toggleMic = () => {
//     localStreamRef.current
//       ?.getAudioTracks()
//       .forEach((t) => (t.enabled = isMuted));
//     setIsMuted(!isMuted);
//   };

//   const toggleVideo = () => {
//     localStreamRef.current
//       ?.getVideoTracks()
//       .forEach((t) => (t.enabled = isVideoOff));
//     setIsVideoOff(!isVideoOff);
//   };

//   const toggleScreen = async () => {
//     if (!isScreenSharing) {
//       try {
//         const stream = await navigator.mediaDevices.getDisplayMedia({
//           video: true,
//         });
//         screenStreamRef.current = stream;
//         if (localVideoRef.current) localVideoRef.current.srcObject = stream;
//         setIsScreenSharing(true);
//         stream.getVideoTracks()[0].onended = () => {
//           if (localVideoRef.current && localStreamRef.current)
//             localVideoRef.current.srcObject = localStreamRef.current;
//           setIsScreenSharing(false);
//         };
//       } catch {}
//     } else {
//       screenStreamRef.current?.getTracks().forEach((t) => t.stop());
//       if (localVideoRef.current && localStreamRef.current)
//         localVideoRef.current.srcObject = localStreamRef.current;
//       setIsScreenSharing(false);
//     }
//   };

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = () => {
//     if (!msgInput.trim()) return;
//     sendMessage(msgInput.trim(), msgType);
//     setMsgInput("");
//     setMsgType("text");
//   };

//   const handleCreatePoll = () => {
//     const validOptions = pollOptions.filter((o) => o.trim());
//     if (!pollQuestion.trim() || validOptions.length < 2) {
//       notifications.show({
//         color: "red",
//         message: "Add a question and at least 2 options",
//       });
//       return;
//     }
//     createPoll(pollQuestion.trim(), validOptions);
//     setPollQuestion("");
//     setPollOptions(["", ""]);
//     closePoll();
//   };

//   const handleEndClass = () => {
//     endMeetingSocket();
//     EndMeeting(meetingId)
//       .then(() => {
//         SuccessNotification("Class Ended Successfully");
//         router.push("/meetings");
//       })
//       .catch((err: any) => {
//         ErrorNotification(
//           err?.response?.data?.message || "Failed To End Class",
//         );
//       });
//   };

//   // Change this:
//   // const activePollCount = useMemo(() => polls.filter(p => p.isActive).length, [polls]);

//   // To this:
//   const activePollCount = useMemo(
//     () => ((polls.length > 0 && polls) || []).filter((p) => p.isActive).length,
//     [polls],
//   );

//   if (loading) {
//     return (
//       <Center h="100vh">
//         <Stack align="center" gap="md">
//           <Loader size="lg" color="violet" />
//           <Text c="dimmed">Joining classroom...</Text>
//         </Stack>
//       </Center>
//     );
//   }

//   return (
//     <Box
//       style={{
//         height: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         background: "#0f0f1a",
//       }}
//     >
//       <Box
//         px="lg"
//         py="sm"
//         style={{
//           background: "rgba(255,255,255,0.04)",
//           borderBottom: "1px solid rgba(255,255,255,0.08)",
//           backdropFilter: "blur(10px)",
//         }}
//       >
//         <Group justify="space-between">
//           <Group gap="md">
//             <Box
//               p={8}
//               style={{
//                 background: "linear-gradient(135deg, #667eea, #764ba2)",
//                 borderRadius: 10,
//               }}
//             >
//               <IconVideo size={18} color="white" />
//             </Box>
//             <Box>
//               <Text c="white" fw={600} size="sm">
//                 {meeting?.title}
//               </Text>
//               <Group gap="xs">
//                 <Text c="gray.5" size="xs">
//                   {meeting?.subject}
//                 </Text>
//                 <Text c="gray.6" size="xs">
//                   •
//                 </Text>
//                 <Text c="gray.5" size="xs">
//                   {meeting?.className}
//                 </Text>
//               </Group>
//             </Box>
//           </Group>
//           <Group gap="md">
//             {meeting?.status === "live" && (
//               <Group gap="xs">
//                 <Box
//                   w={8}
//                   h={8}
//                   style={{
//                     borderRadius: "50%",
//                     background: "#22c55e",
//                     animation: "pulse 2s infinite",
//                   }}
//                 />
//                 <Text c="green.4" size="sm" fw={500}>
//                   {formatElapsed(elapsed)}
//                 </Text>
//               </Group>
//             )}
//             <Badge
//               color={isConnected ? "green" : "red"}
//               variant="dot"
//               size="sm"
//             >
//               {isConnected ? "Connected" : "Reconnecting..."}
//             </Badge>
//             <Badge color="violet" variant="light" size="sm">
//               Code: {meeting?.meetingCode}
//             </Badge>
//             <Badge color={ROLE_COLORS[role] || "blue"} size="sm">
//               {role}
//             </Badge>
//           </Group>
//         </Group>
//       </Box>

//       <Box style={{ flex: 1, display: "flex" }}>
//         <Box
//           style={{
//             flex: 1,
//             display: "flex",
//             flexDirection: "column",
//             position: "relative",
//           }}
//         >
//           <Box style={{ flex: 1, position: "relative", background: "#111122" }}>
//             <video
//               ref={localVideoRef}
//               autoPlay
//               muted
//               playsInline
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 objectFit: isScreenSharing ? "contain" : "cover",
//                 transform: isScreenSharing ? "none" : "scaleX(-1)",
//               }}
//             />
//             {isVideoOff && (
//               <Center
//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   background: "#1a1a2e",
//                 }}
//               >
//                 <Stack align="center" gap="sm">
//                   <Avatar size={80} radius={80} color="violet">
//                     {userName ? userName.charAt(0).toUpperCase() : "U"}
//                   </Avatar>
//                   <Text c="white" size="sm">
//                     {userName}
//                   </Text>
//                 </Stack>
//               </Center>
//             )}
//             <Box
//               style={{
//                 position: "absolute",
//                 bottom: 12,
//                 left: 12,
//                 background: "rgba(0,0,0,0.6)",
//                 backdropFilter: "blur(4px)",
//                 padding: "4px 10px",
//                 borderRadius: 20,
//               }}
//             >
//               <Text c="white" size="xs">
//                 {userName} (You)
//               </Text>
//             </Box>
//             {isScreenSharing && (
//               <Badge
//                 style={{ position: "absolute", top: 12, left: 12 }}
//                 color="blue"
//                 leftSection={<IconScreenShare size={10} />}
//               >
//                 Screen Sharing
//               </Badge>
//             )}
//           </Box>
//           <Box
//             py="md"
//             style={{
//               background: "rgba(255,255,255,0.03)",
//               borderTop: "1px solid rgba(255,255,255,0.06)",
//             }}
//           >
//             <Group justify="center" gap="md">
//               <ControlBtn
//                 active={!isMuted}
//                 icon={
//                   isMuted ? (
//                     <IconMicrophoneOff size={18} />
//                   ) : (
//                     <IconMicrophone size={18} />
//                   )
//                 }
//                 label={isMuted ? "Unmute" : "Mute"}
//                 onClick={toggleMic}
//                 color={isMuted ? "red" : "gray"}
//               />
//               <ControlBtn
//                 active={!isVideoOff}
//                 icon={
//                   isVideoOff ? (
//                     <IconVideoOff size={18} />
//                   ) : (
//                     <IconVideo size={18} />
//                   )
//                 }
//                 label={isVideoOff ? "Start Video" : "Stop Video"}
//                 onClick={toggleVideo}
//                 color={isVideoOff ? "red" : "gray"}
//               />
//               {isTeacher && (
//                 <ControlBtn
//                   active={isScreenSharing}
//                   icon={
//                     isScreenSharing ? (
//                       <IconScreenShareOff size={18} />
//                     ) : (
//                       <IconScreenShare size={18} />
//                     )
//                   }
//                   label={isScreenSharing ? "Stop Share" : "Share Screen"}
//                   onClick={toggleScreen}
//                   color={isScreenSharing ? "blue" : "gray"}
//                 />
//               )}
//               {isTeacher && (
//                 <ControlBtn
//                   active={false}
//                   icon={<IconMenu4 size={18} />}
//                   label="Create Poll"
//                   onClick={openPoll}
//                   color="violet"
//                 />
//               )}
//               {isTeacher && meeting?.status !== "live" && (
//                 <Button
//                   size="sm"
//                   color="green"
//                   radius="xl"
//                   onClick={handleStartMeeting}
//                 >
//                   Start Class
//                 </Button>
//               )}
//               <Tooltip label="Leave / End Class">
//                 <ActionIcon
//                   size={52}
//                   radius="xl"
//                   color="red"
//                   variant="filled"
//                   onClick={
//                     isTeacher ? handleEndClass : () => router.push("/meetings")
//                   }
//                 >
//                   <IconPhoneOff size={22} />
//                 </ActionIcon>
//               </Tooltip>
//             </Group>
//           </Box>
//         </Box>
//         <Box
//           w={360}
//           style={{
//             borderLeft: "1px solid rgba(255,255,255,0.08)",
//             display: "flex",
//             flexDirection: "column",
//             background: "#13131f",
//           }}
//         >
//           <Tabs
//             defaultValue="chat"
//             styles={{
//               root: {
//                 height: "100%",
//                 display: "flex",
//                 flexDirection: "column",
//               },
//             }}
//           >
//             <Tabs.List
//               px="sm"
//               pt="xs"
//               style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
//             >
//               <Tabs.Tab
//                 value="chat"
//                 leftSection={<IconMessage size={14} />}
//                 c="white"
//               >
//                 Chat{" "}
//                 {messages.length > 0 && (
//                   <Badge size="xs" ml="xs" color="violet">
//                     {messages.length}
//                   </Badge>
//                 )}
//               </Tabs.Tab>
//               <Tabs.Tab
//                 value="participants"
//                 leftSection={<IconUsers size={14} />}
//                 c="white"
//               >
//                 People ({participants.length})
//               </Tabs.Tab>
//               <Tabs.Tab
//                 value="polls"
//                 leftSection={<IconMenu4 size={14} />}
//                 c="white"
//               >
//                 Polls{" "}
//                 {activePollCount > 0 && (
//                   <Badge size="xs" ml="xs" color="green">
//                     {activePollCount}
//                   </Badge>
//                 )}
//               </Tabs.Tab>
//             </Tabs.List>
//             <Tabs.Panel
//               value="chat"
//               style={{
//                 flex: 1,
//                 display: "flex",
//                 flexDirection: "column",
//                 overflow: "hidden",
//               }}
//             >
//               <ScrollArea style={{ flex: 1 }} p="sm">
//                 {messages?.length === 0 ? (
//                   <Center h="100%">
//                     <Text size="sm" c="dimmed">
//                       No messages yet.
//                     </Text>
//                   </Center>
//                 ) : (
//                   messages.length > 0 &&
//                   messages.map((msg, i) => (
//                     <MemoizedChatBubble
//                       key={msg._id || msg.timestamp || i}
//                       msg={msg}
//                       currentUserId={userId}
//                     />
//                   ))
//                 )}
//                 <div ref={chatEndRef} />
//               </ScrollArea>
//               <Box
//                 p="sm"
//                 style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
//               >
//                 <Group gap="xs" mb="xs">
//                   <Button
//                     size="xs"
//                     variant={msgType === "text" ? "filled" : "subtle"}
//                     color="violet"
//                     onClick={() => setMsgType("text")}
//                   >
//                     Message
//                   </Button>
//                   {!isTeacher && (
//                     <Button
//                       size="xs"
//                       variant={msgType === "question" ? "filled" : "subtle"}
//                       color="orange"
//                       leftSection={<IconHelpCircle size={12} />}
//                       onClick={() => setMsgType("question")}
//                     >
//                       Ask Question
//                     </Button>
//                   )}
//                 </Group>
//                 <Group gap="xs">
//                   <TextInput
//                     placeholder={
//                       msgType === "question"
//                         ? "Type your question..."
//                         : "Type a message..."
//                     }
//                     value={msgInput}
//                     onChange={(e) => setMsgInput(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//                     style={{ flex: 1 }}
//                     styles={{
//                       input: {
//                         background: "rgba(255,255,255,0.06)",
//                         color: "white",
//                         border: "1px solid rgba(255,255,255,0.1)",
//                       },
//                     }}
//                   />
//                   <ActionIcon
//                     size="lg"
//                     color="violet"
//                     variant="filled"
//                     radius="md"
//                     onClick={handleSendMessage}
//                   >
//                     <IconSend size={16} />
//                   </ActionIcon>
//                 </Group>
//               </Box>
//             </Tabs.Panel>
//             {/* ── PARTICIPANTS TAB ── */}
//             <Tabs.Panel
//               value="participants"
//               style={{ flex: 1, overflow: "hidden" }}
//             >
//               <ScrollArea h="100%" p="sm">
//                 {/* Use (participants || []).map(...) to prevent the crash */}
//                 {((participants.length && participants) || []).map((p, i) => (
//                   <Group
//                     key={p.userId || i}
//                     py="xs"
//                     px="sm"
//                     mb="xs"
//                     style={{
//                       borderRadius: 8,
//                       background:
//                         p.userId === userId
//                           ? "rgba(103,78,234,0.15)"
//                           : "rgba(255,255,255,0.04)",
//                     }}
//                   >
//                     <Avatar
//                       size={32}
//                       radius={32}
//                       color={ROLE_COLORS[p.role] || "blue"}
//                     >
//                       {p.name ? p.name.charAt(0).toUpperCase() : "U"}
//                     </Avatar>
//                     <Box style={{ flex: 1, minWidth: 0 }}>
//                       <Text c="white" size="sm" truncate>
//                         {p.name || "Unknown"}{" "}
//                         {p.userId === userId ? "(You)" : ""}
//                       </Text>
//                       <Badge size="xs" color={ROLE_COLORS[p.role] || "blue"}>
//                         {p.role}
//                       </Badge>
//                     </Box>
//                     <Box
//                       w={8}
//                       h={8}
//                       style={{ borderRadius: "50%", background: "#22c55e" }}
//                     />
//                   </Group>
//                 ))}
//               </ScrollArea>
//             </Tabs.Panel>

//             <Tabs.Panel value="polls" style={{ flex: 1, overflow: "hidden" }}>
//               <ScrollArea h="100%" p="sm">
//                 {isTeacher && (
//                   <Button
//                     fullWidth
//                     variant="light"
//                     color="violet"
//                     mb="md"
//                     leftSection={<IconPlus size={14} />}
//                     onClick={openPoll}
//                   >
//                     Create New Poll
//                   </Button>
//                 )}
//                 {(Array.isArray(polls) ? [...polls].reverse() : []).map(
//                   (poll: any, i) => (
//                     <Paper
//                       key={poll._id || i}
//                       p="md"
//                       mb="sm"
//                       style={{
//                         background: poll.isActive
//                           ? "rgba(103,78,234,0.1)"
//                           : "rgba(255,255,255,0.04)",
//                         border: `1px solid ${poll.isActive ? "rgba(103,78,234,0.3)" : "rgba(255,255,255,0.08)"}`,
//                         borderRadius: 10,
//                       }}
//                     >
//                       <Group justify="space-between" mb="sm">
//                         <Text c="white" size="sm" fw={500}>
//                           {poll.question}
//                         </Text>
//                         <Group gap="xs">
//                           {poll.isActive ? (
//                             <Badge color="green" size="xs" variant="dot">
//                               Live
//                             </Badge>
//                           ) : (
//                             <Badge color="gray" size="xs">
//                               Closed
//                             </Badge>
//                           )}
//                         </Group>
//                       </Group>
//                       <Stack gap={6}>
//                         {poll.options.map((option: any, idx: number) => {
//                           const count = poll.votes?.[String(idx)] || 0;
//                           const totalVotes: any = Object.values(
//                             poll.votes || {},
//                           ).reduce((a: number, b: any) => a + b, 0);
//                           const pct =
//                             totalVotes > 0
//                               ? Math.round((count / totalVotes) * 100)
//                               : 0;
//                           const hasVoted = poll.voters?.includes(userId);
//                           return (
//                             <Box
//                               key={idx}
//                               style={{
//                                 cursor:
//                                   poll.isActive && !hasVoted
//                                     ? "pointer"
//                                     : "default",
//                                 borderRadius: 8,
//                                 overflow: "hidden",
//                                 border: "1px solid rgba(255,255,255,0.1)",
//                               }}
//                               onClick={() =>
//                                 poll.isActive &&
//                                 !hasVoted &&
//                                 votePoll(poll._id, idx)
//                               }
//                             >
//                               <Box
//                                 style={{
//                                   position: "relative",
//                                   padding: "8px 12px",
//                                 }}
//                               >
//                                 <Box
//                                   style={{
//                                     position: "absolute",
//                                     inset: 0,
//                                     width: `${pct}%`,
//                                     background:
//                                       hasVoted || !poll.isActive
//                                         ? "rgba(103,78,234,0.2)"
//                                         : "rgba(255,255,255,0.05)",
//                                     transition: "width 0.5s ease",
//                                   }}
//                                 />
//                                 <Group
//                                   justify="space-between"
//                                   style={{ position: "relative" }}
//                                 >
//                                   <Text size="sm" c="white">
//                                     {option}
//                                   </Text>
//                                   {(hasVoted || !poll.isActive) && (
//                                     <Text size="xs" c="violet.4" fw={600}>
//                                       {pct}% ({count})
//                                     </Text>
//                                   )}
//                                 </Group>
//                               </Box>
//                             </Box>
//                           );
//                         })}
//                       </Stack>
//                     </Paper>
//                   ),
//                 )}
//               </ScrollArea>
//             </Tabs.Panel>
//           </Tabs>
//         </Box>
//       </Box>

//       <Modal
//         opened={pollModalOpen}
//         onClose={closePoll}
//         title="Create Poll"
//         centered
//         size="md"
//       >
//         <Stack>
//           <TextInput
//             label="Question"
//             placeholder="e.g., Which formula is correct?"
//             value={pollQuestion}
//             onChange={(e) => setPollQuestion(e.target.value)}
//           />
//           <Text size="sm" fw={500}>
//             Options
//           </Text>
//           {pollOptions.map((opt, i) => (
//             <Group key={i} gap="xs">
//               <TextInput
//                 placeholder={`Option ${i + 1}`}
//                 value={opt}
//                 onChange={(e) => {
//                   const arr = [...pollOptions];
//                   arr[i] = e.target.value;
//                   setPollOptions(arr);
//                 }}
//                 style={{ flex: 1 }}
//               />
//               {pollOptions.length > 2 && (
//                 <ActionIcon
//                   color="red"
//                   variant="subtle"
//                   onClick={() =>
//                     setPollOptions(pollOptions.filter((_, j) => j !== i))
//                   }
//                 >
//                   <IconX size={14} />
//                 </ActionIcon>
//               )}
//             </Group>
//           ))}
//           {pollOptions.length < 5 && (
//             <Button
//               variant="subtle"
//               leftSection={<IconPlus size={14} />}
//               onClick={() => setPollOptions([...pollOptions, ""])}
//             >
//               Add Option
//             </Button>
//           )}
//           <Divider />
//           <Group justify="flex-end">
//             <Button variant="default" onClick={closePoll}>
//               Cancel
//             </Button>
//             <Button color="violet" onClick={handleCreatePoll}>
//               Launch Poll
//             </Button>
//           </Group>
//         </Stack>
//       </Modal>
//     </Box>
//   );
// }

// // Optimized ChatBubble
// const MemoizedChatBubble = React.memo(function ChatBubble({
//   msg,
//   currentUserId,
// }: {
//   msg: ChatMessage;
//   currentUserId: string;
// }) {
//   const isMe = msg.senderId === currentUserId;
//   const senderRole = msg.senderRole || "student";
//   const roleColor = ROLE_COLORS[senderRole] || "blue";
//   const typeColors: Record<string, string> = {
//     question: "rgba(251,146,60,0.15)",
//     answer: "rgba(34,197,94,0.1)",
//     text: isMe ? "rgba(103,78,234,0.25)" : "rgba(255,255,255,0.06)",
//   };
//   const finalMessage = msg.message || (msg as any).text || "";

//   return (
//     <Box
//       mb="xs"
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: isMe ? "flex-end" : "flex-start",
//       }}
//     >
//       {!isMe && (
//         <Group gap={6} mb={2}>
//           <Avatar size={18} radius={18} color={roleColor}>
//             {msg.senderName?.charAt(0).toUpperCase() || "U"}
//           </Avatar>
//           <Text size="xs" c={`${roleColor}.4`}>
//             {msg.senderName || "Unknown"}
//           </Text>
//           {msg.type && msg.type !== "text" && (
//             <Badge
//               size="xs"
//               color={msg.type === "question" ? "orange" : "green"}
//             >
//               {msg.type}
//             </Badge>
//           )}
//         </Group>
//       )}
//       <Box
//         px="sm"
//         py={6}
//         maw="80%"
//         style={{
//           background: typeColors[msg.type] || typeColors.text,
//           borderRadius: isMe ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
//           border:
//             msg.type === "question" ? "1px solid rgba(251,146,60,0.3)" : "none",
//         }}
//       >
//         <Text size="sm" c="white">
//           {finalMessage}
//         </Text>
//         <Text size="xs" c="gray.6" mt={2}>
//           {msg.timestamp
//             ? dayjs(msg.timestamp).format("hh:mm A")
//             : dayjs().format("hh:mm A")}
//         </Text>
//       </Box>
//     </Box>
//   );
// });

// function ControlBtn({
//   icon,
//   label,
//   onClick,
//   active,
//   color,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   onClick: () => void;
//   active: boolean;
//   color: string;
// }) {
//   return (
//     <Tooltip label={label}>
//       <ActionIcon
//         size={52}
//         radius="xl"
//         color={color}
//         variant={active ? "light" : "filled"}
//         onClick={onClick}
//       >
//         {icon}
//       </ActionIcon>
//     </Tooltip>
//   );
// }

"use client";
import React, {
  useEffect,
  useRef,useState,useCallback, useMemo,
} from "react";
import {
  Box, Button, Group, Text, Badge, ActionIcon, Stack, TextInput, Avatar, ScrollArea, Tabs,
  Divider,Modal,Tooltip,Loader, Center, Paper,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconMicrophone, IconMicrophoneOff,
  IconVideo,
  IconVideoOff,  IconScreenShare, IconScreenShareOff, IconPhoneOff, IconSend, IconMenu4, IconUsers,
  IconMessage, IconHelpCircle, IconPlus,
  IconX,
} from "@tabler/icons-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  ChatMessage,
  Meeting,
  Poll,
  UserRole,
} from "@/app/components/meeting/meeting.types";
import { useMeetingSocket } from "@/app/components/meeting/useMeetingSocket";
import {
  EndMeeting,
  GetMeeting,
  StartMeeting,
} from "@/axios/institute/MeetingApi";
import {
  ErrorNotification,
  SuccessNotification,
} from "@/app/helperFunction/Notification";

dayjs.extend(relativeTime);

const ROLE_COLORS: Record<UserRole, string> = {
  teacher: "violet",
  admin: "orange",
  student: "blue",
};

// Premium palette tokens (kept local so nothing else in the app is affected)
const BG = "linear-gradient(180deg, #0a0a14 0%, #0d0d1a 55%, #0a0a14 100%)";
const PANEL = "rgba(255,255,255,0.035)";
const PANEL_BORDER = "rgba(255,255,255,0.08)";
const ACCENT_GRAD = "linear-gradient(135deg, #7c6cf0 0%, #5b4fd6 100%)";
const GLASS = "rgba(15,15,26,0.55)";
const HOVER_TINT = "rgba(124,108,240,0.14)";

export default function MeetingRoomPage() {
  
  const params:any = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const meetingId = params?.id as string;

  const redirectUrl = searchParams?.get("redirect");

  console.log("Redirect URL:", redirectUrl);

  const role = (searchParams?.get("role") || "student") as UserRole;
  const userId = searchParams?.get("userId") || "user_" + Date.now();
  const userName = decodeURIComponent(searchParams?.get("name") || "Unknown");
  const isTeacher = role === "teacher" || role === "admin";

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [msgInput, setMsgInput] = useState("");
  const [msgType, setMsgType] = useState<"text" | "question" | "answer">(
    "text",
  );
  const [pollModalOpen, { open: openPoll, close: closePoll }] =
    useDisclosure(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [elapsed, setElapsed] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const handleMeetingStarted = useCallback(() => {
    notifications.show({
      color: "green",
      title: "Class Started!",
      message: "The teacher has started the class.",
    });
    setMeeting((prev) => (prev ? { ...prev, status: "live" } : prev));
  }, []);

  // const handleMeetingEnded = useCallback(() => {
  //   notifications.show({
  //     color: "orange",
  //     title: "Class Ended",
  //     message: "The teacher has ended the class.",
  //   });
  //   setTimeout(() => router.push("/meetings"), 3000);
  // }, [router]);
  const handleMeetingEnded = useCallback(() => {
  notifications.show({
    color: "orange",
    title: "Class Ended",
    message: "The teacher has ended the class.",
  });

  setTimeout(() => {
    if (redirectUrl) {
      router.push(decodeURIComponent(redirectUrl));
    } else {
      router.push("/meetings");
    }
  }, 3000);
}, [router, redirectUrl]);

  const {
    isConnected,
    messages = [],
    participants = [],
    polls = [],
    sendMessage,
    createPoll,
    votePoll,
    closePoll: closeActivePoll,
    startMeeting: socketStart,
    endMeetingSocket,
  } = useMeetingSocket({
    meetingId,
    userId,
    name: userName,
    role,
    onMeetingStarted: handleMeetingStarted,
    onMeetingEnded: handleMeetingEnded,
  });
  const loadMeeting = useCallback(() => {
    setLoading(true);
    GetMeeting(meetingId)
      .then((res: any) => {
        setMeeting(res?.data || res);
        setLoading(false);
      })
      .catch(() => {
        ErrorNotification("Meeting Not Found");
        setLoading(false);
        // router.push("/meetings");
          if (redirectUrl) {
    router.push(decodeURIComponent(redirectUrl));
  } else {
    router.push("/meetings");
  }
      });
  }, [meetingId, router]);

  useEffect(() => {
    loadMeeting();
  }, [loadMeeting]);

  const handleStartMeeting = useCallback(() => {
    socketStart();
    StartMeeting(meetingId)
      .then(() => {
        SuccessNotification("Class Started Successfully");
        setMeeting((prev) => (prev ? { ...prev, status: "live" } : prev));
      })
      .catch((err: any) => {
        ErrorNotification(
          err?.response?.data?.message || "Failed To Start Class",
        );
      });
  }, [meetingId, socketStart]);

  useEffect(() => {
    if (meeting?.status !== "live") return;
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, [meeting?.status]);

  const formatElapsed = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
      : `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      } catch {
        console.warn("Camera/Mic not available");
      }
    };
    startCamera();
    return () => {
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const toggleMic = () => {
    localStreamRef.current
      ?.getAudioTracks()
      .forEach((t) => (t.enabled = isMuted));
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    localStreamRef.current
      ?.getVideoTracks()
      .forEach((t) => (t.enabled = isVideoOff));
    setIsVideoOff(!isVideoOff);
  };

  const toggleScreen = async () => {
    if (!isScreenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        screenStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        setIsScreenSharing(true);
        stream.getVideoTracks()[0].onended = () => {
          if (localVideoRef.current && localStreamRef.current)
            localVideoRef.current.srcObject = localStreamRef.current;
          setIsScreenSharing(false);
        };
      } catch {}
    } else {
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      if (localVideoRef.current && localStreamRef.current)
        localVideoRef.current.srcObject = localStreamRef.current;
      setIsScreenSharing(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!msgInput.trim()) return;
    sendMessage(msgInput.trim(), msgType);
    setMsgInput("");
    setMsgType("text");
  };

  const handleCreatePoll = () => {
    const validOptions = pollOptions.filter((o) => o.trim());
    if (!pollQuestion.trim() || validOptions.length < 2) {
      notifications.show({
        color: "red",
        message: "Add a question and at least 2 options",
      });
      return;
    }
    createPoll(pollQuestion.trim(), validOptions);
    setPollQuestion("");
    setPollOptions(["", ""]);
    closePoll();
  };

  const handleEndClass = () => {
    endMeetingSocket();
    EndMeeting(meetingId)
      .then(() => {
        SuccessNotification("Class Ended Successfully");
       if (redirectUrl) {
      router.push(decodeURIComponent(redirectUrl));
    } else {
      router.push("/meetings");
    }
      })
      .catch((err: any) => {
        ErrorNotification(
          err?.response?.data?.message || "Failed To End Class",
        );
      });
  };

  const activePollCount = useMemo(
    () => ((polls.length > 0 && polls) || []).filter((p) => p.isActive).length,
    [polls],
  );

  if (loading) {
    return (
      <Center h="100vh" style={{ background: BG }}>
        <Stack align="center" gap="md">
          <Loader size="lg" color="violet" />
          <Text c="dimmed">Joining classroom...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Box
      className="meeting-root"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: BG,
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* ── Responsive + hover theme rules (visual only, no logic changes) ── */}
      <style jsx global>{`
        .meeting-root {
          overflow: hidden;
        }
        .meeting-body {
          min-height: 0;
        }
        .video-stage-wrap {
          min-width: 0;
        }
        .meeting-tabs [data-active="true"],
        .meeting-tabs [data-active] {
          background: ${ACCENT_GRAD} !important;
          color: #fff !important;
        }
        .meeting-tabs button[role="tab"]:hover {
          background: ${HOVER_TINT} !important;
          color: #fff !important;
        }
        .meeting-tabs button[role="tab"][data-active]:hover {
          background: ${ACCENT_GRAD} !important;
        }
        .mm-btn:hover {
          filter: brightness(1.12);
        }
        .mm-input-btn:hover {
          background: rgba(255, 255, 255, 0.09) !important;
        }

        @media (max-width: 900px) {
          .meeting-body {
            flex-direction: column !important;
          }
          .video-stage-wrap {
            flex: none !important;
            height: 46vh !important;
            padding: 8px !important;
          }
          .side-panel {
            width: 100% !important;
            flex: 1 !important;
            border-left: none !important;
            border-top: 1px solid ${PANEL_BORDER};
            min-height: 0;
          }
          .header-group {
            flex-wrap: wrap;
            row-gap: 6px;
          }
          .control-bar {
            transform: translateX(-50%) scale(0.82);
            bottom: 10px !important;
            padding: 8px 12px !important;
          }
        }

        @media (max-width: 480px) {
          .video-stage-wrap {
            height: 40vh !important;
          }
          .control-bar {
            transform: translateX(-50%) scale(0.72);
          }
        }
      `}</style>

      {/* ── HEADER ── */}
      <Box
        px="lg"
        py="sm"
        style={{
          background: PANEL,
          borderBottom: `1px solid ${PANEL_BORDER}`,
          backdropFilter: "blur(16px)",
          zIndex: 5,
        }}
      >
        <Group justify="space-between" className="header-group">
          <Group gap="md">
            <Box
              p={8}
              style={{
                background: ACCENT_GRAD,
                borderRadius: 10,
                boxShadow: "0 4px 14px rgba(124,108,240,0.35)",
              }}
            >
              <IconVideo size={18} color="white" />
            </Box>
            <Box>
              <Text c="white" fw={600} size="sm">
                {meeting?.title}
              </Text>
              <Group gap={6}>
                <Text c="gray.5" size="xs">
                  {meeting?.subject}
                </Text>
                <Text c="gray.7" size="xs">
                  •
                </Text>
                <Text c="gray.5" size="xs">
                  {meeting?.className}
                </Text>
              </Group>
            </Box>
          </Group>
          <Group gap="sm">
            {meeting?.status === "live" && (
              <Group
                gap={8}
                px={10}
                py={4}
                style={{
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.25)",
                  borderRadius: 20,
                }}
              >
                <Box
                  w={7}
                  h={7}
                  style={{
                    borderRadius: "50%",
                    background: "#22c55e",
                    animation: "pulse 2s infinite",
                  }}
                />
                <Text c="green.4" size="xs" fw={600}>
                  {formatElapsed(elapsed)}
                </Text>
              </Group>
            )}
            <Badge
              color={isConnected ? "green" : "red"}
              variant="dot"
              size="sm"
              radius="sm"
              styles={{ root: { background: "rgba(255,255,255,0.04)" } }}
            >
              {isConnected ? "Connected" : "Reconnecting..."}
            </Badge>
            <Badge
              variant="light"
              size="sm"
              radius="sm"
              styles={{
                root: {
                  background: "rgba(124,108,240,0.12)",
                  color: "#a99bff",
                },
              }}
            >
              Code: {meeting?.meetingCode}
            </Badge>
            <Badge color={ROLE_COLORS[role] || "blue"} size="sm" radius="sm">
              {role}
            </Badge>
          </Group>
        </Group>
      </Box>

      <Box className="meeting-body" style={{ flex: 1, display: "flex" }}>
        {/* ── VIDEO STAGE ── */}
        <Box
          className="video-stage-wrap"
          style={{
            flex: 1,
            position: "relative",
            padding: 14,
          }}
        >
          <Box
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: 18,
              overflow: "hidden",
              background: "#111122",
              border: `1px solid ${PANEL_BORDER}`,
              boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
            }}
          >
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: isScreenSharing ? "contain" : "cover",
                transform: isScreenSharing ? "none" : "scaleX(-1)",
                background: "#0d0d18",
              }}
            />
            {isVideoOff && (
              <Center
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at 50% 40%, #1c1c30 0%, #12121f 70%)",
                }}
              >
                <Stack align="center" gap="sm">
                  <Avatar
                    size={84}
                    radius={84}
                    style={{
                      background: ACCENT_GRAD,
                      boxShadow: "0 8px 24px rgba(124,108,240,0.35)",
                    }}
                  >
                    <Text fw={700} size="xl" c="white">
                      {userName ? userName.charAt(0).toUpperCase() : "U"}
                    </Text>
                  </Avatar>
                  <Text c="white" size="sm" fw={500}>
                    {userName}
                  </Text>
                </Stack>
              </Center>
            )}

            {/* Top-left status badges */}
            <Group style={{ position: "absolute", top: 14, left: 14 }} gap={8}>
              {isScreenSharing && (
                <Badge
                  color="blue"
                  variant="filled"
                  leftSection={<IconScreenShare size={10} />}
                  radius="sm"
                  style={{ boxShadow: "0 4px 12px rgba(59,130,246,0.4)" }}
                >
                  Presenting
                </Badge>
              )}
              {isMuted && (
                <Badge
                  color="red"
                  variant="filled"
                  leftSection={<IconMicrophoneOff size={10} />}
                  radius="sm"
                >
                  Muted
                </Badge>
              )}
            </Group>

            {/* Name tag */}
            <Box
              style={{
                position: "absolute",
                bottom: 84,
                left: 14,
                background: GLASS,
                backdropFilter: "blur(8px)",
                padding: "5px 12px",
                borderRadius: 20,
                border: `1px solid ${PANEL_BORDER}`,
              }}
            >
              <Text c="white" size="xs" fw={500}>
                {userName} (You)
              </Text>
            </Box>

            {/* ── FLOATING CONTROL BAR (overlaid directly on the video, no gap) ── */}
            <Group
              justify="center"
              gap="sm"
              className="control-bar"
              style={{
                position: "absolute",
                bottom: 18,
                left: "50%",
                transform: "translateX(-50%)",
                background: GLASS,
                backdropFilter: "blur(18px)",
                border: `1px solid ${PANEL_BORDER}`,
                borderRadius: 999,
                padding: "10px 16px",
                boxShadow: "0 12px 34px rgba(0,0,0,0.45)",
              }}
            >
              <ControlBtn
                active={!isMuted}
                icon={
                  isMuted ? (
                    <IconMicrophoneOff size={18} />
                  ) : (
                    <IconMicrophone size={18} />
                  )
                }
                label={isMuted ? "Unmute" : "Mute"}
                onClick={toggleMic}
                color={isMuted ? "red" : "gray"}
              />
              <ControlBtn
                active={!isVideoOff}
                icon={
                  isVideoOff ? (
                    <IconVideoOff size={18} />
                  ) : (
                    <IconVideo size={18} />
                  )
                }
                label={isVideoOff ? "Start Video" : "Stop Video"}
                onClick={toggleVideo}
                color={isVideoOff ? "red" : "gray"}
              />
              <ControlBtn
                active={isScreenSharing}
                icon={
                  isScreenSharing ? (
                    <IconScreenShareOff size={18} />
                  ) : (
                    <IconScreenShare size={18} />
                  )
                }
                label={isScreenSharing ? "Stop Share" : "Share Screen"}
                onClick={toggleScreen}
                color={isScreenSharing ? "blue" : "gray"}
              />
              {isTeacher && (
                <ControlBtn
                  active={false}
                  icon={<IconMenu4 size={18} />}
                  label="Create Poll"
                  onClick={openPoll}
                  color="violet"
                />
              )}
              {isTeacher && meeting?.status !== "live" && (
                <Button
                  size="sm"
                  radius="xl"
                  onClick={handleStartMeeting}
                  className="mm-btn"
                  styles={{
                    root: {
                      background: "linear-gradient(135deg, #22c55e, #16a34a)",
                      boxShadow: "0 6px 18px rgba(34,197,94,0.35)",
                      border: "none",
                    },
                  }}
                >
                  Start Class
                </Button>
              )}
              <Tooltip label="Leave / End Class">
                <ActionIcon
                  size={52}
                  radius="xl"
                  variant="filled"
                  className="mm-btn"
                 onClick={
  isTeacher
    ? handleEndClass
    : () => {
        if (redirectUrl) {
          router.push(decodeURIComponent(redirectUrl));
        } else {
          router.push("/meetings");
        }
      }
}
                  styles={{
                    root: {
                      background: "linear-gradient(135deg, #ef4444, #dc2626)",
                      boxShadow: "0 6px 18px rgba(239,68,68,0.4)",
                    },
                  }}
                >
                  <IconPhoneOff size={22} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Box>
        </Box>

        {/* ── SIDE PANEL ── */}
        <Box
          w={370}
          className="side-panel"
          style={{
            borderLeft: `1px solid ${PANEL_BORDER}`,
            display: "flex",
            flexDirection: "column",
            background: "#0d0d17",
          }}
        >
          <Tabs
            defaultValue="chat"
            variant="pills"
            radius="md"
            className="meeting-tabs"
            styles={{
              root: {
                height: "100%",
                display: "flex",
                flexDirection: "column",
              },
              list: {
                gap: 4,
              },
            }}
          >
            <Tabs.List
              px="sm"
              pt="sm"
              pb="sm"
              style={{ borderBottom: `1px solid ${PANEL_BORDER}` }}
            >
              <Tabs.Tab
                value="chat"
                leftSection={<IconMessage size={14} />}
                styles={{
                  tab: {
                    color: "#c9c7d6",
                    transition: "background 0.15s ease, color 0.15s ease",
                    "&[data-active]": {
                      background: ACCENT_GRAD,
                      color: "white",
                    },
                    "&:hover": {
                      background: HOVER_TINT,
                      color: "white",
                    },
                  },
                }}
              >
                Chat{" "}
                {messages.length > 0 && (
                  <Badge size="xs" ml={6} circle color="dark.4">
                    {messages.length}
                  </Badge>
                )}
              </Tabs.Tab>
              <Tabs.Tab
                value="participants"
                leftSection={<IconUsers size={14} />}
                styles={{
                  tab: {
                    color: "#c9c7d6",
                    transition: "background 0.15s ease, color 0.15s ease",
                    "&[data-active]": {
                      background: ACCENT_GRAD,
                      color: "white",
                    },
                    "&:hover": {
                      background: HOVER_TINT,
                      color: "white",
                    },
                  },
                }}
              >
                People ({participants.length})
              </Tabs.Tab>
              <Tabs.Tab
                value="polls"
                leftSection={<IconMenu4 size={14} />}
                styles={{
                  tab: {
                    color: "#c9c7d6",
                    transition: "background 0.15s ease, color 0.15s ease",
                    "&[data-active]": {
                      background: ACCENT_GRAD,
                      color: "white",
                    },
                    "&:hover": {
                      background: HOVER_TINT,
                      color: "white",
                    },
                  },
                }}
              >
                Polls{" "}
                {activePollCount > 0 && (
                  <Badge size="xs" ml={6} color="green" circle>
                    {activePollCount}
                  </Badge>
                )}
              </Tabs.Tab>
            </Tabs.List>

            {/* ── CHAT TAB ── */}
            <Tabs.Panel
              value="chat"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <ScrollArea style={{ flex: 1 }} p="sm">
                {messages?.length === 0 ? (
                  <Center h="100%">
                    <Stack align="center" gap={4}>
                      <IconMessage size={28} color="#4b4860" />
                      <Text size="sm" c="dimmed">
                        No messages yet
                      </Text>
                    </Stack>
                  </Center>
                ) : (
                  messages.length > 0 &&
                  messages.map((msg, i) => (
                    <MemoizedChatBubble
                      key={msg._id || msg.timestamp || i}
                      msg={msg}
                      currentUserId={userId}
                    />
                  ))
                )}
                <div ref={chatEndRef} />
              </ScrollArea>
              <Box
                p="sm"
                style={{ borderTop: `1px solid ${PANEL_BORDER}` }}
              >
                <Group gap="xs" mb="xs">
                  <Button
                    size="xs"
                    radius="xl"
                    variant={msgType === "text" ? "filled" : "subtle"}
                    color="violet"
                    onClick={() => setMsgType("text")}
                    className={msgType === "text" ? "mm-btn" : "mm-input-btn"}
                    styles={
                      msgType === "text"
                        ? { root: { background: ACCENT_GRAD, border: "none" } }
                        : { root: { color: "#a9a6ba" } }
                    }
                  >
                    Message
                  </Button>
                  {!isTeacher && (
                    <Button
                      size="xs"
                      radius="xl"
                      variant={msgType === "question" ? "filled" : "subtle"}
                      color="orange"
                      leftSection={<IconHelpCircle size={12} />}
                      onClick={() => setMsgType("question")}
                      className={
                        msgType === "question" ? "mm-btn" : "mm-input-btn"
                      }
                    >
                      Ask Question
                    </Button>
                  )}
                </Group>
                <Group gap="xs">
                  <TextInput
                    placeholder={
                      msgType === "question"
                        ? "Type your question..."
                        : "Type a message..."
                    }
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    radius="xl"
                    style={{ flex: 1 }}
                    styles={{
                      input: {
                        background: "rgba(255,255,255,0.05)",
                        color: "white",
                        border: `1px solid ${PANEL_BORDER}`,
                        "&:focus": {
                          borderColor: "#7c6cf0",
                        },
                      },
                    }}
                  />
                  <ActionIcon
                    size="lg"
                    radius="xl"
                    variant="filled"
                    className="mm-btn"
                    onClick={handleSendMessage}
                    styles={{
                      root: { background: ACCENT_GRAD },
                    }}
                  >
                    <IconSend size={16} />
                  </ActionIcon>
                </Group>
              </Box>
            </Tabs.Panel>

            {/* ── PARTICIPANTS TAB ── */}
            <Tabs.Panel
              value="participants"
              style={{ flex: 1, overflow: "hidden" }}
            >
              <ScrollArea h="100%" p="sm">
                {((participants.length && participants) || []).map((p, i) => (
                  <Group
                    key={p.userId || i}
                    py="xs"
                    px="sm"
                    mb="xs"
                    style={{
                      borderRadius: 10,
                      background:
                        p.userId === userId
                          ? "rgba(124,108,240,0.14)"
                          : "rgba(255,255,255,0.03)",
                      border: `1px solid ${
                        p.userId === userId
                          ? "rgba(124,108,240,0.3)"
                          : "transparent"
                      }`,
                    }}
                  >
                    <Avatar
                      size={34}
                      radius={34}
                      color={ROLE_COLORS[p.role] || "blue"}
                    >
                      {p.name ? p.name.charAt(0).toUpperCase() : "U"}
                    </Avatar>
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text c="white" size="sm" fw={500} truncate>
                        {p.name || "Unknown"}{" "}
                        {p.userId === userId ? "(You)" : ""}
                      </Text>
                      <Badge size="xs" color={ROLE_COLORS[p.role] || "blue"} radius="sm">
                        {p.role}
                      </Badge>
                    </Box>
                    <Box
                      w={8}
                      h={8}
                      style={{
                        borderRadius: "50%",
                        background: "#22c55e",
                        boxShadow: "0 0 8px rgba(34,197,94,0.6)",
                      }}
                    />
                  </Group>
                ))}
              </ScrollArea>
            </Tabs.Panel>

            {/* ── POLLS TAB ── */}
            <Tabs.Panel value="polls" style={{ flex: 1, overflow: "hidden" }}>
              <ScrollArea h="100%" p="sm">
                {isTeacher && (
                  <Button
                    fullWidth
                    radius="md"
                    mb="md"
                    leftSection={<IconPlus size={14} />}
                    onClick={openPoll}
                    className="mm-input-btn"
                    styles={{
                      root: {
                        background: "rgba(124,108,240,0.12)",
                        color: "#b3a8ff",
                        border: "1px solid rgba(124,108,240,0.3)",
                      },
                    }}
                  >
                    Create New Poll
                  </Button>
                )}
                {(Array.isArray(polls) ? [...polls].reverse() : []).map(
                  (poll: any, i) => (
                    <Paper
                      key={poll._id || i}
                      p="md"
                      mb="sm"
                      radius="md"
                      style={{
                        background: poll.isActive
                          ? "rgba(124,108,240,0.08)"
                          : "rgba(255,255,255,0.03)",
                        border: `1px solid ${poll.isActive ? "rgba(124,108,240,0.3)" : PANEL_BORDER}`,
                      }}
                    >
                      <Group justify="space-between" mb="sm">
                        <Text c="white" size="sm" fw={600}>
                          {poll.question}
                        </Text>
                        <Group gap="xs">
                          {poll.isActive ? (
                            <Badge color="green" size="xs" variant="dot">
                              Live
                            </Badge>
                          ) : (
                            <Badge color="gray" size="xs">
                              Closed
                            </Badge>
                          )}
                        </Group>
                      </Group>
                      <Stack gap={6}>
                        {poll.options.map((option: any, idx: number) => {
                          const count = poll.votes?.[String(idx)] || 0;
                          const totalVotes: any = Object.values(
                            poll.votes || {},
                          ).reduce((a: number, b: any) => a + b, 0);
                          const pct =
                            totalVotes > 0
                              ? Math.round((count / totalVotes) * 100)
                              : 0;
                          const hasVoted = poll.voters?.includes(userId);
                          return (
                            <Box
                              key={idx}
                              style={{
                                cursor:
                                  poll.isActive && !hasVoted
                                    ? "pointer"
                                    : "default",
                                borderRadius: 8,
                                overflow: "hidden",
                                border: `1px solid ${PANEL_BORDER}`,
                              }}
                              onClick={() =>
                                poll.isActive &&
                                !hasVoted &&
                                votePoll(poll._id, idx)
                              }
                            >
                              <Box
                                style={{
                                  position: "relative",
                                  padding: "8px 12px",
                                }}
                              >
                                <Box
                                  style={{
                                    position: "absolute",
                                    inset: 0,
                                    width: `${pct}%`,
                                    background:
                                      hasVoted || !poll.isActive
                                        ? "linear-gradient(90deg, rgba(124,108,240,0.28), rgba(91,79,214,0.18))"
                                        : "rgba(255,255,255,0.04)",
                                    transition: "width 0.5s ease",
                                  }}
                                />
                                <Group
                                  justify="space-between"
                                  style={{ position: "relative" }}
                                >
                                  <Text size="sm" c="white">
                                    {option}
                                  </Text>
                                  {(hasVoted || !poll.isActive) && (
                                    <Text size="xs" c="violet.3" fw={700}>
                                      {pct}% ({count})
                                    </Text>
                                  )}
                                </Group>
                              </Box>
                            </Box>
                          );
                        })}
                      </Stack>
                    </Paper>
                  ),
                )}
              </ScrollArea>
            </Tabs.Panel>
          </Tabs>
        </Box>
      </Box>

      {/* ── CREATE POLL MODAL ── */}
      <Modal
        opened={pollModalOpen}
        onClose={closePoll}
        title="Create Poll"
        centered
        size="md"
        radius="md"
        styles={{
          content: { background: "#14141f" },
          header: { background: "#14141f" },
          title: { color: "white", fontWeight: 600 },
        }}
      >
        <Stack>
          <TextInput
            label="Question"
            placeholder="e.g., Which formula is correct?"
            value={pollQuestion}
            onChange={(e) => setPollQuestion(e.target.value)}
            styles={{
              label: { color: "#c9c7d6" },
              input: {
                background: "rgba(255,255,255,0.05)",
                color: "white",
                border: `1px solid ${PANEL_BORDER}`,
              },
            }}
          />
          <Text size="sm" fw={500} c="gray.3">
            Options
          </Text>
          {pollOptions.map((opt, i) => (
            <Group key={i} gap="xs">
              <TextInput
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(e) => {
                  const arr = [...pollOptions];
                  arr[i] = e.target.value;
                  setPollOptions(arr);
                }}
                style={{ flex: 1 }}
                styles={{
                  input: {
                    background: "rgba(255,255,255,0.05)",
                    color: "white",
                    border: `1px solid ${PANEL_BORDER}`,
                  },
                }}
              />
              {pollOptions.length > 2 && (
                <ActionIcon
                  color="red"
                  variant="subtle"
                  onClick={() =>
                    setPollOptions(pollOptions.filter((_, j) => j !== i))
                  }
                >
                  <IconX size={14} />
                </ActionIcon>
              )}
            </Group>
          ))}
          {pollOptions.length < 5 && (
            <Button
              variant="subtle"
              leftSection={<IconPlus size={14} />}
              onClick={() => setPollOptions([...pollOptions, ""])}
            >
              Add Option
            </Button>
          )}
          <Divider color={PANEL_BORDER} />
          <Group justify="flex-end">
            <Button variant="default" onClick={closePoll}>
              Cancel
            </Button>
            <Button
              onClick={handleCreatePoll}
              className="mm-btn"
              styles={{ root: { background: ACCENT_GRAD, border: "none" } }}
            >
              Launch Poll
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}

// Optimized ChatBubble
const MemoizedChatBubble = React.memo(function ChatBubble({
  msg,
  currentUserId,
}: {
  msg: ChatMessage;
  currentUserId: string;
}) {
  const isMe = msg.senderId === currentUserId;
  const senderRole = msg.senderRole || "student";
  const roleColor = ROLE_COLORS[senderRole] || "blue";
  const typeColors: Record<string, string> = {
    question: "rgba(251,146,60,0.15)",
    answer: "rgba(34,197,94,0.1)",
    text: isMe
      ? "linear-gradient(135deg, rgba(124,108,240,0.32), rgba(91,79,214,0.22))"
      : "rgba(255,255,255,0.05)",
  };
  const finalMessage = msg.message || (msg as any).text || "";

  return (
    <Box
      mb="xs"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isMe ? "flex-end" : "flex-start",
      }}
    >
      {!isMe && (
        <Group gap={6} mb={2}>
          <Avatar size={18} radius={18} color={roleColor}>
            {msg.senderName?.charAt(0).toUpperCase() || "U"}
          </Avatar>
          <Text size="xs" c={`${roleColor}.4`} fw={500}>
            {msg.senderName || "Unknown"}
          </Text>
          {msg.type && msg.type !== "text" && (
            <Badge
              size="xs"
              color={msg.type === "question" ? "orange" : "green"}
            >
              {msg.type}
            </Badge>
          )}
        </Group>
      )}
      <Box
        px="sm"
        py={6}
        maw="80%"
        style={{
          background: typeColors[msg.type] || typeColors.text,
          borderRadius: isMe ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
          border:
            msg.type === "question" ? "1px solid rgba(251,146,60,0.3)" : "none",
        }}
      >
        <Text size="sm" c="white">
          {finalMessage}
        </Text>
        <Text size="xs" c="gray.6" mt={2}>
          {msg.timestamp
            ? dayjs(msg.timestamp).format("hh:mm A")
            : dayjs().format("hh:mm A")}
        </Text>
      </Box>
    </Box>
  );
});

function ControlBtn({
  icon,
  label,
  onClick,
  active,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active: boolean;
  color: string;
}) {
  const isNeutral = color === "gray";
  return (
    <Tooltip label={label}>
      <ActionIcon
        size={50}
        radius="xl"
        variant={active ? "light" : "filled"}
        onClick={onClick}
        color={isNeutral ? undefined : color}
        className="mm-btn"
        styles={
          isNeutral
            ? {
                root: active
                  ? {
                      background: "rgba(255,255,255,0.08)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }
                  : {
                      background: "rgba(239,68,68,0.9)",
                      color: "white",
                    },
              }
            : undefined
        }
      >
        {icon}
      </ActionIcon>
    </Tooltip>
  );
}
