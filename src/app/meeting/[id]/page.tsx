// "use client";
// import {
//   Box, Button, Group, Text, Badge, ActionIcon, Stack,
//   TextInput, Textarea, Avatar, ScrollArea, Tabs, Divider,
//   Modal, Progress, Tooltip, Loader, Center, Paper,
// } from "@mantine/core";
// import { useDisclosure } from "@mantine/hooks";
// import { notifications } from "@mantine/notifications";
// import {
//   IconMicrophone, IconMicrophoneOff, IconVideo, IconVideoOff,
//   IconScreenShare, IconScreenShareOff, IconPhoneOff, IconSend,
//   IconMenu4, IconUsers, IconMessage, IconHelpCircle, IconPlus,
//   IconTrash, IconX, IconCheck, IconClock,
// } from "@tabler/icons-react";
// import { useEffect, useRef, useState, useCallback } from "react";
// import { useParams, useRouter, useSearchParams } from "next/navigation";
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
// import { ChatMessage, Meeting, Poll, UserRole } from "@/app/components/meeting/meeting.types";
// import { useMeetingSocket } from "@/app/components/meeting/useMeetingSocket";
// import { EndMeeting, GetMeeting, StartMeeting, } from "@/axios/institute/MeetingApi";
// import { ErrorNotification, SuccessNotification } from "@/app/helperFunction/Notification";

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

//   // URL query params (passed from meetings list)
//   const role = (searchParams.get("role") || "student") as UserRole;
//   const userId = searchParams.get("userId") || "user_" + Date.now();
//   const userName = decodeURIComponent(searchParams.get("name") || "Unknown");

//   const isTeacher = role === "teacher" || role === "admin";

//   // ─── State ──────────────────────────────────────────────────────────────
//   const [meeting, setMeeting] = useState<Meeting | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isVideoOff, setIsVideoOff] = useState(false);
//   const [isScreenSharing, setIsScreenSharing] = useState(false);
//   const [msgInput, setMsgInput] = useState("");
//   const [msgType, setMsgType] = useState<"text" | "question">("text");
//   const [pollModalOpen, { open: openPoll, close: closePoll }] = useDisclosure(false);
//   const [pollQuestion, setPollQuestion] = useState("");
//   const [pollOptions, setPollOptions] = useState(["", ""]);
//   const [elapsed, setElapsed] = useState(0);

//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const localStreamRef = useRef<MediaStream | null>(null);
//   const chatEndRef = useRef<HTMLDivElement>(null);
//   const screenStreamRef = useRef<MediaStream | null>(null);

//   // ─── Socket ─────────────────────────────────────────────────────────────
//   const {
//     isConnected,
//     messages,
//     participants,
//     polls,
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
//     onMeetingStarted: () => {
//       notifications.show({ color: "green", title: "Class Started!", message: "The teacher has started the class." });
//       setMeeting((prev) => prev ? { ...prev, status: "live" } : prev);
//     },
//     onMeetingEnded: () => {
//       notifications.show({ color: "orange", title: "Class Ended", message: "The teacher has ended the class." });
//       setTimeout(() => router.push("/meetings"), 3000);
//     },
//   });

//   // ─── Load meeting ────────────────────────────────────────────────────────
//   const loadMeeting = () => {
//     setLoading(true);

//     GetMeeting(meetingId)
//       .then((res: any) => {
//         console.log("GET MEETING SUCCESS =>", res);

//         setMeeting(res?.data || res);

//         setLoading(false);
//       })
//       .catch((err: any) => {
//         console.log("GET MEETING ERROR =>", err);

//         ErrorNotification("Meeting Not Found");

//         setLoading(false);

//         router.push("/meetings");
//       });
//   };

//   useEffect(() => {
//     loadMeeting();
//   }, [meetingId]);


//   const handleStartMeeting = () => {
//     socketStart();

//     StartMeeting(meetingId)
//       .then((res: any) => {
//         console.log("START MEETING SUCCESS =>", res);

//         SuccessNotification("Class Started Successfully");

//         setMeeting((prev) =>
//           prev ? { ...prev, status: "live" } : prev
//         );
//       })
//       .catch((err: any) => {
//         console.log("START MEETING ERROR =>", err);

//         ErrorNotification(
//           err?.response?.data?.message ||
//           "Failed To Start Class"
//         );
//       });
//   };

//   // ─── Timer ──────────────────────────────────────────────────────────────
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

//   // ─── Camera ─────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const startCamera = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         localStreamRef.current = stream;
//         if (localVideoRef.current) localVideoRef.current.srcObject = stream;
//       } catch {
//         console.warn("Camera/Mic not available");
//       }
//     };
//     startCamera();
//     return () => { localStreamRef.current?.getTracks().forEach((t) => t.stop()); };
//   }, []);

//   const toggleMic = () => {
//     localStreamRef.current?.getAudioTracks().forEach((t) => (t.enabled = isMuted));
//     setIsMuted(!isMuted);
//   };

//   const toggleVideo = () => {
//     localStreamRef.current?.getVideoTracks().forEach((t) => (t.enabled = isVideoOff));
//     setIsVideoOff(!isVideoOff);
//   };

//   const toggleScreen = async () => {
//     if (!isScreenSharing) {
//       try {
//         const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
//         screenStreamRef.current = stream;
//         if (localVideoRef.current) localVideoRef.current.srcObject = stream;
//         setIsScreenSharing(true);
//         stream.getVideoTracks()[0].onended = () => {
//           if (localVideoRef.current && localStreamRef.current)
//             localVideoRef.current.srcObject = localStreamRef.current;
//           setIsScreenSharing(false);
//         };
//       } catch { }
//     } else {
//       screenStreamRef.current?.getTracks().forEach((t) => t.stop());
//       if (localVideoRef.current && localStreamRef.current)
//         localVideoRef.current.srcObject = localStreamRef.current;
//       setIsScreenSharing(false);
//     }
//   };

//   // ─── Chat ────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = () => {
//     if (!msgInput.trim()) return;
//     sendMessage(msgInput.trim(), msgType);
//     setMsgInput("");
//     setMsgType("text");
//   };

//   // ─── Polls ───────────────────────────────────────────────────────────────
//   const handleCreatePoll = () => {
//     const validOptions = pollOptions.filter((o) => o.trim());
//     if (!pollQuestion.trim() || validOptions.length < 2) {
//       notifications.show({ color: "red", message: "Add a question and at least 2 options" });
//       return;
//     }
//     createPoll(pollQuestion.trim(), validOptions);
//     setPollQuestion("");
//     setPollOptions(["", ""]);
//     closePoll();
//   };

//   const getPollTotal = (poll: Poll) =>
//     Object.values(poll.votes || {}).reduce((a, b) => a + b, 0);

//   // ─── End class ──────────────────────────────────────────────────────────
//   const handleEndClass = () => {
//     endMeetingSocket();

//     EndMeeting(meetingId)
//       .then((res: any) => {
//         console.log("END MEETING SUCCESS =>", res);

//         SuccessNotification("Class Ended Successfully");

//         router.push("/meetings");
//       })
//       .catch((err: any) => {
//         console.log("END MEETING ERROR =>", err);

//         ErrorNotification(
//           err?.response?.data?.message ||
//           "Failed To End Class"
//         );
//       });
//   };

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
//     <Box style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#0f0f1a",}}>
//       {/* ── Top Bar ─────────────────────────────────────────────────── */}
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
//               <Text c="white" fw={600} size="sm">{meeting?.title}</Text>
//               <Group gap="xs">
//                 <Text c="gray.5" size="xs">{meeting?.subject}</Text>
//                 <Text c="gray.6" size="xs">•</Text>
//                 <Text c="gray.5" size="xs">{meeting?.className}</Text>
//               </Group>
//             </Box>
//           </Group>
//           <Group gap="md">
//             {meeting?.status === "live" && (
//               <Group gap="xs">
//                 <Box w={8} h={8} style={{ borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
//                 <Text c="green.4" size="sm" fw={500}>{formatElapsed(elapsed)}</Text>
//               </Group>
//             )}
//             <Badge color={isConnected ? "green" : "red"} variant="dot" size="sm">
//               {isConnected ? "Connected" : "Reconnecting..."}
//             </Badge>
//             <Badge color="violet" variant="light" size="sm">
//               Code: {meeting?.meetingCode}
//             </Badge>
//             <Badge color={ROLE_COLORS[role]} size="sm">{role}</Badge>
//           </Group>
//         </Group>
//       </Box>

//       {/* ── Main Content ─────────────────────────────────────────────── */}
//       <Box style={{ flex: 1, display: "flex",  }}>
//         {/* ── Video Area ── */}
//         <Box style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
//           {/* Local Video */}
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
//                 style={{ position: "absolute", inset: 0, background: "#1a1a2e" }}
//               >
//                 <Stack align="center" gap="sm">
//                   <Avatar size={80} radius={80} color="violet">
//                     {userName.charAt(0).toUpperCase()}
//                   </Avatar>
//                   <Text c="white" size="sm">{userName}</Text>
//                 </Stack>
//               </Center>
//             )}
//             {/* Name tag */}
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
//               <Text c="white" size="xs">{userName} (You)</Text>
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

//           {/* ── Controls ── */}
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
//                 icon={isMuted ? <IconMicrophoneOff size={18} /> : <IconMicrophone size={18} />}
//                 label={isMuted ? "Unmute" : "Mute"}
//                 onClick={toggleMic}
//                 color={isMuted ? "red" : "gray"}
//               />
//               <ControlBtn
//                 active={!isVideoOff}
//                 icon={isVideoOff ? <IconVideoOff size={18} /> : <IconVideo size={18} />}
//                 label={isVideoOff ? "Start Video" : "Stop Video"}
//                 onClick={toggleVideo}
//                 color={isVideoOff ? "red" : "gray"}
//               />
//               {isTeacher && (
//                 <ControlBtn
//                   active={isScreenSharing}
//                   icon={isScreenSharing ? <IconScreenShareOff size={18} /> : <IconScreenShare size={18} />}
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
//                   onClick={isTeacher ? handleEndClass : () => router.push("/meetings")}
//                 >
//                   <IconPhoneOff size={22} />
//                 </ActionIcon>
//               </Tooltip>
//             </Group>
//           </Box>
//         </Box>

//         {/* ── Sidebar ── */}
//         <Box
//           w={360}
//           style={{
//             borderLeft: "1px solid rgba(255,255,255,0.08)",
//             display: "flex",
//             flexDirection: "column",
//             background: "#13131f",
//           }}
//         >
//           <Tabs defaultValue="chat" styles={{ root: { height: "100%", display: "flex", flexDirection: "column" } }}>
//             <Tabs.List px="sm" pt="xs" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
//               <Tabs.Tab value="chat" leftSection={<IconMessage size={14} />} c="white">
//                 Chat
//                 {messages.length > 0 && (
//                   <Badge size="xs" ml="xs" color="violet">{messages.length}</Badge>
//                 )}
//               </Tabs.Tab>
//               <Tabs.Tab value="participants" leftSection={<IconUsers size={14} />} c="white">
//                 People ({participants.length})
//               </Tabs.Tab>
//               <Tabs.Tab value="polls" leftSection={<IconMenu4 size={14} />} c="white">
//                 Polls
//                 {polls.filter((p) => p.isActive).length > 0 && (
//                   <Badge size="xs" ml="xs" color="green">{polls.filter((p) => p.isActive).length}</Badge>
//                 )}
//               </Tabs.Tab>
//             </Tabs.List>

//             {/* ── CHAT TAB ── */}
//             <Tabs.Panel value="chat" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
//               <ScrollArea style={{ flex: 1 }} p="sm">
//                 {messages.map((msg, i) => (
//                   <ChatBubble key={i} msg={msg} currentUserId={userId} />
//                 ))}
//                 <div ref={chatEndRef} />
//               </ScrollArea>
//               <Box p="sm" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
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
//                     placeholder={msgType === "question" ? "Type your question..." : "Type a message..."}
//                     value={msgInput}
//                     onChange={(e) => setMsgInput(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//                     style={{ flex: 1 }}
//                     styles={{ input: { background: "rgba(255,255,255,0.06)", color: "white", border: "1px solid rgba(255,255,255,0.1)" } }}
//                   />
//                   <ActionIcon size="lg" color="violet" variant="filled" radius="md" onClick={handleSendMessage}>
//                     <IconSend size={16} />
//                   </ActionIcon>
//                 </Group>
//               </Box>
//             </Tabs.Panel>

//             {/* ── PARTICIPANTS TAB ── */}
//             <Tabs.Panel value="participants" style={{ flex: 1, overflow: "hidden" }}>
//               <ScrollArea h="100%" p="sm">
//                 {participants.map((p, i) => (
//                   <Group key={i} py="xs" px="sm" mb="xs" style={{
//                     borderRadius: 8,
//                     background: p.userId === userId ? "rgba(103,78,234,0.15)" : "rgba(255,255,255,0.04)",
//                   }}>
//                     <Avatar size={32} radius={32} color={ROLE_COLORS[p.role]}>
//                       {p.name.charAt(0).toUpperCase()}
//                     </Avatar>
//                     <Box style={{ flex: 1, minWidth: 0 }}>
//                       <Text c="white" size="sm" truncate>{p.name} {p.userId === userId ? "(You)" : ""}</Text>
//                       <Badge size="xs" color={ROLE_COLORS[p.role]}>{p.role}</Badge>
//                     </Box>
//                     <Box w={8} h={8} style={{ borderRadius: "50%", background: "#22c55e" }} />
//                   </Group>
//                 ))}
//                 {participants.length === 0 && (
//                   <Center py="xl">
//                     <Text c="gray.6" size="sm">No one has joined yet</Text>
//                   </Center>
//                 )}
//               </ScrollArea>
//             </Tabs.Panel>

//             {/* ── POLLS TAB ── */}
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
//                 {polls.length === 0 && (
//                   <Center py="xl">
//                     <Stack align="center" gap="xs">
//                       <IconMenu4 size={32} color="gray" />
//                       <Text c="gray.6" size="sm">No polls yet</Text>
//                     </Stack>
//                   </Center>
//                 )}
//                 {[...polls].reverse().map((poll) => (
//                   <PollCard
//                     key={poll._id}
//                     poll={poll}
//                     userId={userId}
//                     isTeacher={isTeacher}
//                     onVote={(idx) => votePoll(poll._id, idx)}
//                     onClose={() => closeActivePoll(poll._id)}
//                   />
//                 ))}
//               </ScrollArea>
//             </Tabs.Panel>
//           </Tabs>
//         </Box>
//       </Box>

//       {/* ── Create Poll Modal ── */}
//       <Modal opened={pollModalOpen} onClose={closePoll} title="Create Poll" centered size="md">
//         <Stack>
//           <TextInput
//             label="Question"
//             placeholder="e.g., Which formula is correct?"
//             value={pollQuestion}
//             onChange={(e) => setPollQuestion(e.target.value)}
//           />
//           <Text size="sm" fw={500}>Options</Text>
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
//                 <ActionIcon color="red" variant="subtle" onClick={() => setPollOptions(pollOptions.filter((_, j) => j !== i))}>
//                   <IconX size={14} />
//                 </ActionIcon>
//               )}
//             </Group>
//           ))}
//           {pollOptions.length < 5 && (
//             <Button variant="subtle" leftSection={<IconPlus size={14} />} onClick={() => setPollOptions([...pollOptions, ""])}>
//               Add Option
//             </Button>
//           )}
//           <Divider />
//           <Group justify="flex-end">
//             <Button variant="default" onClick={closePoll}>Cancel</Button>
//             <Button color="violet" onClick={handleCreatePoll}>Launch Poll</Button>
//           </Group>
//         </Stack>
//       </Modal>
//     </Box>
//   );
// }

// // ── Chat Bubble ──────────────────────────────────────────────────────────────
// function ChatBubble({ msg, currentUserId }: { msg: ChatMessage; currentUserId: string }) {
//   const isMe = msg.senderId === currentUserId;
//   const typeColors: Record<string, string> = {
//     question: "rgba(251,146,60,0.15)",
//     answer: "rgba(34,197,94,0.1)",
//     text: isMe ? "rgba(103,78,234,0.25)" : "rgba(255,255,255,0.06)",
//   };

//   return (
//     <Box mb="xs" style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
//       {!isMe && (
//         <Group gap={6} mb={2}>
//           <Avatar size={18} radius={18} color={ROLE_COLORS[msg.senderRole]}>
//             {msg.senderName.charAt(0)}
//           </Avatar>
//           <Text size="xs" c={ROLE_COLORS[msg.senderRole] + ".4"}>{msg.senderName}</Text>
//           {msg.type !== "text" && (
//             <Badge size="xs" color={msg.type === "question" ? "orange" : "green"}>{msg.type}</Badge>
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
//           border: msg.type === "question" ? "1px solid rgba(251,146,60,0.3)" : "none",
//         }}
//       >
//         <Text size="sm" c="white">{msg.message}</Text>
//         <Text size="xs" c="gray.6" mt={2}>{dayjs(msg.timestamp).format("hh:mm A")}</Text>
//       </Box>
//     </Box>
//   );
// }

// // ── Poll Card ────────────────────────────────────────────────────────────────
// function PollCard({
//   poll, userId, isTeacher, onVote, onClose,
// }: {
//   poll: Poll;
//   userId: string;
//   isTeacher: boolean;
//   onVote: (i: number) => void;
//   onClose: () => void;
// }) {
//   const hasVoted = poll.voters?.includes(userId);
//   const total = Object.values(poll.votes || {}).reduce((a, b) => a + b, 0);

//   return (
//     <Paper
//       p="md"
//       mb="sm"
//       style={{
//         background: poll.isActive ? "rgba(103,78,234,0.1)" : "rgba(255,255,255,0.04)",
//         border: `1px solid ${poll.isActive ? "rgba(103,78,234,0.3)" : "rgba(255,255,255,0.08)"}`,
//         borderRadius: 10,
//       }}
//     >
//       <Group justify="space-between" mb="sm">
//         <Text c="white" size="sm" fw={500} style={{ flex: 1 }}>{poll.question}</Text>
//         <Group gap="xs">
//           {poll.isActive ? (
//             <Badge color="green" size="xs" variant="dot">Live</Badge>
//           ) : (
//             <Badge color="gray" size="xs">Closed</Badge>
//           )}
//           {isTeacher && poll.isActive && (
//             <ActionIcon size="xs" color="red" variant="subtle" onClick={onClose}>
//               <IconX size={12} />
//             </ActionIcon>
//           )}
//         </Group>
//       </Group>
//       <Stack gap={6}>
//         {poll.options.map((option, i) => {
//           const count = poll.votes?.[String(i)] || 0;
//           const pct = total > 0 ? Math.round((count / total) * 100) : 0;
//           return (
//             <Box
//               key={i}
//               style={{
//                 cursor: poll.isActive && !hasVoted ? "pointer" : "default",
//                 borderRadius: 8,
//                 overflow: "hidden",
//                 border: "1px solid rgba(255,255,255,0.1)",
//               }}
//               onClick={() => poll.isActive && !hasVoted && onVote(i)}
//             >
//               <Box style={{ position: "relative", padding: "8px 12px" }}>
//                 <Box
//                   style={{
//                     position: "absolute",
//                     inset: 0,
//                     width: `${pct}%`,
//                     background: hasVoted || !poll.isActive ? "rgba(103,78,234,0.2)" : "rgba(255,255,255,0.05)",
//                     transition: "width 0.5s ease",
//                   }}
//                 />
//                 <Group justify="space-between" style={{ position: "relative" }}>
//                   <Text size="sm" c="white">{option}</Text>
//                   {(hasVoted || !poll.isActive) && (
//                     <Text size="xs" c="violet.4" fw={600}>{pct}% ({count})</Text>
//                   )}
//                 </Group>
//               </Box>
//             </Box>
//           );
//         })}
//       </Stack>
//       <Text size="xs" c="gray.6" mt="xs">{total} vote{total !== 1 ? "s" : ""}</Text>
//     </Paper>
//   );
// }

// // ── Control Button ───────────────────────────────────────────────────────────
// function ControlBtn({ icon, label, onClick, active, color }: {
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
import {
  Box, Button, Group, Text, Badge, ActionIcon, Stack,
  TextInput, Avatar, ScrollArea, Tabs, Divider,
  Modal, Tooltip, Loader, Center, Paper,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconMicrophone, IconMicrophoneOff, IconVideo, IconVideoOff,
  IconScreenShare, IconScreenShareOff, IconPhoneOff, IconSend,
  IconMenu4, IconUsers, IconMessage, IconHelpCircle, IconPlus,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ChatMessage, Meeting, Poll, UserRole } from "@/app/components/meeting/meeting.types";
import { useMeetingSocket } from "@/app/components/meeting/useMeetingSocket";
import { EndMeeting, GetMeeting, StartMeeting, } from "@/axios/institute/MeetingApi";
import { ErrorNotification, SuccessNotification } from "@/app/helperFunction/Notification";

dayjs.extend(relativeTime);

const ROLE_COLORS: Record<UserRole, string> = {
  teacher: "violet",
  admin: "orange",
  student: "blue",
};

export default function MeetingRoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const meetingId = params.id as string;

  // URL query params
  const role = (searchParams.get("role") || "student") as UserRole;
  const userId = searchParams.get("userId") || "user_" + Date.now();
  const userName = decodeURIComponent(searchParams.get("name") || "Unknown");

  const isTeacher = role === "teacher" || role === "admin";

  // ─── State ──────────────────────────────────────────────────────────────
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [msgInput, setMsgInput] = useState("");
  const [msgType, setMsgType] = useState<"text" | "question" | "answer">("text");
  const [pollModalOpen, { open: openPoll, close: closePoll }] = useDisclosure(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [elapsed, setElapsed] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // री-रेंडर को रोकने के लिए सॉकेट कॉलबैक्स को useCallback में रैप किया
  const handleMeetingStarted = useCallback(() => {
    notifications.show({ color: "green", title: "Class Started!", message: "The teacher has started the class." });
    setMeeting((prev) => prev ? { ...prev, status: "live" } : prev);
  }, []);

  const handleMeetingEnded = useCallback(() => {
    notifications.show({ color: "orange", title: "Class Ended", message: "The teacher has ended the class." });
    setTimeout(() => router.push("/meetings"), 3000);
  }, [router]);

  // ─── Socket Hook ─────────────────────────────────────────────────────────
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

  // ─── Load meeting ────────────────────────────────────────────────────────
  const loadMeeting = useCallback(() => {
    setLoading(true);
    GetMeeting(meetingId)
      .then((res: any) => {
        console.log("GET MEETING SUCCESS =>", res);
        setMeeting(res?.data || res);
        setLoading(false);
      })
      .catch((err: any) => {
        console.log("GET MEETING ERROR =>", err);
        ErrorNotification("Meeting Not Found");
        setLoading(false);
        router.push("/meetings");
      });
  }, [meetingId, router]);

  useEffect(() => {
    loadMeeting();
  }, [loadMeeting]);

  const handleStartMeeting = () => {
    socketStart();
    StartMeeting(meetingId)
      .then((res: any) => {
        console.log("START MEETING SUCCESS =>", res);
        SuccessNotification("Class Started Successfully");
        setMeeting((prev) => prev ? { ...prev, status: "live" } : prev);
      })
      .catch((err: any) => {
        console.log("START MEETING ERROR =>", err);
        ErrorNotification(err?.response?.data?.message || "Failed To Start Class");
      });
  };

  // ─── Timer ──────────────────────────────────────────────────────────────
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

  // ─── Camera ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      } catch {
        console.warn("Camera/Mic not available");
      }
    };
    startCamera();
    return () => { localStreamRef.current?.getTracks().forEach((t) => t.stop()); };
  }, []);

  const toggleMic = () => {
    localStreamRef.current?.getAudioTracks().forEach((t) => (t.enabled = isMuted));
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    localStreamRef.current?.getVideoTracks().forEach((t) => (t.enabled = isVideoOff));
    setIsVideoOff(!isVideoOff);
  };

  const toggleScreen = async () => {
    if (!isScreenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        setIsScreenSharing(true);
        stream.getVideoTracks()[0].onended = () => {
          if (localVideoRef.current && localStreamRef.current)
            localVideoRef.current.srcObject = localStreamRef.current;
          setIsScreenSharing(false);
        };
      } catch { }
    } else {
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      if (localVideoRef.current && localStreamRef.current)
        localVideoRef.current.srcObject = localStreamRef.current;
      setIsScreenSharing(false);
    }
  };

  // ─── Chat ────────────────────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!msgInput.trim()) return;
    sendMessage(msgInput.trim(), msgType);
    setMsgInput("");
    setMsgType("text");
  };

  // ─── Polls ───────────────────────────────────────────────────────────────
  const handleCreatePoll = () => {
    const validOptions = pollOptions.filter((o) => o.trim());
    if (!pollQuestion.trim() || validOptions.length < 2) {
      notifications.show({ color: "red", message: "Add a question and at least 2 options" });
      return;
    }
    createPoll(pollQuestion.trim(), validOptions);
    setPollQuestion("");
    setPollOptions(["", ""]);
    closePoll();
  };

  // ─── End class ──────────────────────────────────────────────────────────
  const handleEndClass = () => {
    endMeetingSocket();
    EndMeeting(meetingId)
      .then((res: any) => {
        console.log("END MEETING SUCCESS =>", res);
        SuccessNotification("Class Ended Successfully");
        router.push("/meetings");
      })
      .catch((err: any) => {
        console.log("END MEETING ERROR =>", err);
        ErrorNotification(err?.response?.data?.message || "Failed To End Class");
      });
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Stack align="center" gap="md">
          <Loader size="lg" color="violet" />
          <Text c="dimmed">Joining classroom...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Box style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#0f0f1a",}}>
      {/* ── Top Bar ── */}
      <Box px="lg" py="sm" style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", }}>
        <Group justify="space-between">
          <Group gap="md">
            <Box p={8} style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", borderRadius: 10, }}>
              <IconVideo size={18} color="white" />
            </Box>
            <Box>
              <Text c="white" fw={600} size="sm">{meeting?.title}</Text>
              <Group gap="xs">
                <Text c="gray.5" size="xs">{meeting?.subject}</Text>
                <Text c="gray.6" size="xs">•</Text>
                <Text c="gray.5" size="xs">{meeting?.className}</Text>
              </Group>
            </Box>
          </Group>
          <Group gap="md">
            {meeting?.status === "live" && (
              <Group gap="xs">
                <Box w={8} h={8} style={{ borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
                <Text c="green.4" size="sm" fw={500}>{formatElapsed(elapsed)}</Text>
              </Group>
            )}
            <Badge color={isConnected ? "green" : "red"} variant="dot" size="sm">
              {isConnected ? "Connected" : "Reconnecting..."}
            </Badge>
            <Badge color="violet" variant="light" size="sm">Code: {meeting?.meetingCode}</Badge>
            <Badge color={ROLE_COLORS[role] || "blue"} size="sm">{role}</Badge>
          </Group>
        </Group>
      </Box>

      {/* ── Main Content ── */}
      <Box style={{ flex: 1, display: "flex" }}>
        {/* ── Video Area ── */}
        <Box style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
          <Box style={{ flex: 1, position: "relative", background: "#111122" }}>
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
              }}
            />
            {isVideoOff && (
              <Center style={{ position: "absolute", inset: 0, background: "#1a1a2e" }}>
                <Stack align="center" gap="sm">
                  <Avatar size={80} radius={80} color="violet">
                    {userName ? userName.charAt(0).toUpperCase() : "U"}
                  </Avatar>
                  <Text c="white" size="sm">{userName}</Text>
                </Stack>
              </Center>
            )}
            <Box style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: "4px 10px", borderRadius: 20, }}>
              <Text c="white" size="xs">{userName} (You)</Text>
            </Box>
            {isScreenSharing && (
              <Badge style={{ position: "absolute", top: 12, left: 12 }} color="blue" leftSection={<IconScreenShare size={10} />}>
                Screen Sharing
              </Badge>
            )}
          </Box>

          {/* ── Controls ── */}
          <Box py="md" style={{ background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.06)", }}>
            <Group justify="center" gap="md">
              <ControlBtn active={!isMuted} icon={isMuted ? <IconMicrophoneOff size={18} /> : <IconMicrophone size={18} />} label={isMuted ? "Unmute" : "Mute"} onClick={toggleMic} color={isMuted ? "red" : "gray"} />
              <ControlBtn active={!isVideoOff} icon={isVideoOff ? <IconVideoOff size={18} /> : <IconVideo size={18} />} label={isVideoOff ? "Start Video" : "Stop Video"} onClick={toggleVideo} color={isVideoOff ? "red" : "gray"} />
              {isTeacher && (
                <ControlBtn active={isScreenSharing} icon={isScreenSharing ? <IconScreenShareOff size={18} /> : <IconScreenShare size={18} />} label={isScreenSharing ? "Stop Share" : "Share Screen"} onClick={toggleScreen} color={isScreenSharing ? "blue" : "gray"} />
              )}
              {isTeacher && (
                <ControlBtn active={false} icon={<IconMenu4 size={18} />} label="Create Poll" onClick={openPoll} color="violet" />
              )}
              {isTeacher && meeting?.status !== "live" && (
                <Button size="sm" color="green" radius="xl" onClick={handleStartMeeting}>Start Class</Button>
              )}
              <Tooltip label="Leave / End Class">
                <ActionIcon size={52} radius="xl" color="red" variant="filled" onClick={isTeacher ? handleEndClass : () => router.push("/meetings")}>
                  <IconPhoneOff size={22} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Box>
        </Box>

        {/* ── Sidebar ── */}
        <Box w={360} style={{ borderLeft: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", background: "#13131f", }}>
          <Tabs defaultValue="chat" styles={{ root: { height: "100%", display: "flex", flexDirection: "column" } }}>
            <Tabs.List px="sm" pt="xs" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <Tabs.Tab value="chat" leftSection={<IconMessage size={14} />} c="white">
                Chat {messages.length > 0 && <Badge size="xs" ml="xs" color="violet">{messages.length}</Badge>}
              </Tabs.Tab>
              <Tabs.Tab value="participants" leftSection={<IconUsers size={14} />} c="white">
                People ({participants.length})
              </Tabs.Tab>
              <Tabs.Tab value="polls" leftSection={<IconMenu4 size={14} />} c="white">
                Polls {polls.filter((p) => p.isActive).length > 0 && <Badge size="xs" ml="xs" color="green">{polls.filter((p) => p.isActive).length}</Badge>}
              </Tabs.Tab>
            </Tabs.List>

            {/* ── CHAT TAB ── */}
            <Tabs.Panel value="chat" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <ScrollArea style={{ flex: 1 }} p="sm">
                {messages.length === 0 ? (
                  <Center h="100%">
                    <Text size="sm" c="dimmed">No messages yet.</Text>
                  </Center>
                ) : (
                  messages.map((msg, i) => (
                    <ChatBubble key={msg._id || msg.timestamp || i} msg={msg} currentUserId={userId} />
                  ))
                )}
                <div ref={chatEndRef} />
              </ScrollArea>
              <Box p="sm" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <Group gap="xs" mb="xs">
                  <Button size="xs" variant={msgType === "text" ? "filled" : "subtle"} color="violet" onClick={() => setMsgType("text")}>Message</Button>
                  {!isTeacher && (
                    <Button size="xs" variant={msgType === "question" ? "filled" : "subtle"} color="orange" leftSection={<IconHelpCircle size={12} />} onClick={() => setMsgType("question")}>Ask Question</Button>
                  )}
                </Group>
                <Group gap="xs">
                  <TextInput
                    placeholder={msgType === "question" ? "Type your question..." : "Type a message..."}
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    style={{ flex: 1 }}
                    styles={{ input: { background: "rgba(255,255,255,0.06)", color: "white", border: "1px solid rgba(255,255,255,0.1)" } }}
                  />
                  <ActionIcon size="lg" color="violet" variant="filled" radius="md" onClick={handleSendMessage}>
                    <IconSend size={16} />
                  </ActionIcon>
                </Group>
              </Box>
            </Tabs.Panel>

            {/* ── PARTICIPANTS TAB ── */}
            <Tabs.Panel value="participants" style={{ flex: 1, overflow: "hidden" }}>
              <ScrollArea h="100%" p="sm">
                {participants.map((p, i) => (
                  <Group key={p.userId || i} py="xs" px="sm" mb="xs" style={{ borderRadius: 8, background: p.userId === userId ? "rgba(103,78,234,0.15)" : "rgba(255,255,255,0.04)", }}>
                    <Avatar size={32} radius={32} color={ROLE_COLORS[p.role] || "blue"}>{p.name ? p.name.charAt(0).toUpperCase() : "U"}</Avatar>
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text c="white" size="sm" truncate>{p.name || "Unknown"} {p.userId === userId ? "(You)" : ""}</Text>
                      <Badge size="xs" color={ROLE_COLORS[p.role] || "blue"}>{p.role}</Badge>
                    </Box>
                    <Box w={8} h={8} style={{ borderRadius: "50%", background: "#22c55e" }} />
                  </Group>
                ))}
              </ScrollArea>
            </Tabs.Panel>

            {/* ── POLLS TAB ── */}
            <Tabs.Panel value="polls" style={{ flex: 1, overflow: "hidden" }}>
              <ScrollArea h="100%" p="sm">
                {isTeacher && (
                  <Button fullWidth variant="light" color="violet" mb="md" leftSection={<IconPlus size={14} />} onClick={openPoll}>Create New Poll</Button>
                )}
                {[...polls].reverse().map((poll, i) => (
                  <Paper key={poll._id || i} p="md" mb="sm" style={{ background: poll.isActive ? "rgba(103,78,234,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${poll.isActive ? "rgba(103,78,234,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, }}>
                    {/* Poll Card inside layout */}
                    <Group justify="space-between" mb="sm">
                      <Text c="white" size="sm" fw={500} style={{ flex: 1 }}>{poll.question}</Text>
                      <Group gap="xs">
                        {poll.isActive ? <Badge color="green" size="xs" variant="dot">Live</Badge> : <Badge color="gray" size="xs">Closed</Badge>}
                        {isTeacher && poll.isActive && (
                          <ActionIcon size="xs" color="red" variant="subtle" onClick={() => closeActivePoll(poll._id)}><IconX size={12} /></ActionIcon>
                        )}
                      </Group>
                    </Group>
                    <Stack gap={6}>
                      {poll.options.map((option, idx) => {
                        const count = poll.votes?.[String(idx)] || 0;
                        const totalVotes = Object.values(poll.votes || {}).reduce((a, b) => a + b, 0);
                        const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                        const hasVoted = poll.voters?.includes(userId);
                        return (
                          <Box key={idx} style={{ cursor: poll.isActive && !hasVoted ? "pointer" : "default", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", }} onClick={() => poll.isActive && !hasVoted && votePoll(poll._id, idx)}>
                            <Box style={{ position: "relative", padding: "8px 12px" }}>
                              <Box style={{ position: "absolute", inset: 0, width: `${pct}%`, background: hasVoted || !poll.isActive ? "rgba(103,78,234,0.2)" : "rgba(255,255,255,0.05)", transition: "width 0.5s ease", }} />
                              <Group justify="space-between" style={{ position: "relative" }}>
                                <Text size="sm" c="white">{option}</Text>
                                {(hasVoted || !poll.isActive) && <Text size="xs" c="violet.4" fw={600}>{pct}% ({count})</Text>}
                              </Group>
                            </Box>
                          </Box>
                        );
                      })}
                    </Stack>
                  </Paper>
                ))}
              </ScrollArea>
            </Tabs.Panel>
          </Tabs>
        </Box>
      </Box>

      {/* ── Create Poll Modal ── */}
      <Modal opened={pollModalOpen} onClose={closePoll} title="Create Poll" centered size="md">
        <Stack>
          <TextInput label="Question" placeholder="e.g., Which formula is correct?" value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} />
          <Text size="sm" fw={500}>Options</Text>
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
              />
              {pollOptions.length > 2 && (
                <ActionIcon color="red" variant="subtle" onClick={() => setPollOptions(pollOptions.filter((_, j) => j !== i))}>
                  <IconX size={14} />
                </ActionIcon>
              )}
            </Group>
          ))}
          {pollOptions.length < 5 && (
            <Button variant="subtle" leftSection={<IconPlus size={14} />} onClick={() => setPollOptions([...pollOptions, ""])}>Add Option</Button>
          )}
          <Divider />
          <Group justify="flex-end">
            <Button variant="default" onClick={closePoll}>Cancel</Button>
            <Button color="violet" onClick={handleCreatePoll}>Launch Poll</Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}

// ── Helpers ──
function ChatBubble({ msg, currentUserId }: { msg: ChatMessage; currentUserId: string }) {
  const isMe = msg.senderId === currentUserId;
  const senderRole = msg.senderRole || "student";
  const roleColor = ROLE_COLORS[senderRole] || "blue";

  const typeColors: Record<string, string> = {
    question: "rgba(251,146,60,0.15)",
    answer: "rgba(34,197,94,0.1)",
    text: isMe ? "rgba(103,78,234,0.25)" : "rgba(255,255,255,0.06)",
  };

  const finalMessage = msg.message || (msg as any).text || "";

  return (
    <Box mb="xs" style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
      {!isMe && (
        <Group gap={6} mb={2}>
          <Avatar size={18} radius={18} color={roleColor}>
            {msg.senderName ? msg.senderName.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <Text size="xs" c={`${roleColor}.4`}>{msg.senderName || "Unknown"}</Text>
          {msg.type && msg.type !== "text" && (
            <Badge size="xs" color={msg.type === "question" ? "orange" : "green"}>
              {msg.type}
            </Badge>
          )}
        </Group>
      )}
      <Box px="sm" py={6} maw="80%" style={{ background: typeColors[msg.type] || typeColors.text, borderRadius: isMe ? "12px 12px 2px 12px" : "12px 12px 12px 2px", border: msg.type === "question" ? "1px solid rgba(251,146,60,0.3)" : "none", }}>
        <Text size="sm" c="white">{finalMessage}</Text>
        <Text size="xs" c="gray.6" mt={2}>
          {msg.timestamp ? dayjs(msg.timestamp).format("hh:mm A") : dayjs().format("hh:mm A")}
        </Text>
      </Box>
    </Box>
  );
}

function ControlBtn({ icon, label, onClick, active, color }: { icon: React.ReactNode; label: string; onClick: () => void; active: boolean; color: string; }) {
  return (
    <Tooltip label={label}>
      <ActionIcon size={52} radius="xl" color={color} variant={active ? "light" : "filled"} onClick={onClick}>{icon}</ActionIcon>
    </Tooltip>
  );
}