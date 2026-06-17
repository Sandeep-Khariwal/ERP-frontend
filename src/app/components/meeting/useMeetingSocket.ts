// "use client";
// import { useEffect, useRef, useState, useCallback } from "react";
// import { io, Socket } from "socket.io-client";
// import { ChatMessage, Participant, Poll, UserRole } from "./meeting.types";
// import { socket } from "@/socket/MySocket";
// // import { ChatMessage, Participant, Poll, UserRole } from "../types/meeting.types";
// const NEXT_PUBLIC_SOCKET_URL = "https://server.shikshapay.cloud"

// interface UseMeetingSocketOptions {
//   meetingId: string;
//   userId: string;
//   name: string;
//   role: UserRole;
//   onMeetingStarted?: () => void;
//   onMeetingEnded?: () => void;
// }

// export const useMeetingSocket = ({
//   meetingId,
//   userId,
//   name,
//   role,
//   onMeetingStarted,
//   onMeetingEnded,
// }: UseMeetingSocketOptions) => {
//   const socketRef = useRef<Socket | null>(null);
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [participants, setParticipants] = useState<Participant[]>([]);
//   const [polls, setPolls] = useState<Poll[]>([]);
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//   socketRef.current = socket;

//   if (!socket.connected) {
//     socket.connect();
//   }

//   const handleConnect = () => {
//     console.log("socket id:", socket.id);

//     setIsConnected(true);

//     socket.emit("join-room", {
//       meetingId,
//       userId,
//       name,
//       role,
//     });
//   };

//   socket.on("connect", handleConnect);

//   return () => {
//     socket.off("connect", handleConnect);
//   };
// }, []);

//   useEffect(() => {

//     socketRef.current = socket;

//     socket.on("disconnect", () => {
//       console.log("disconected : ", socket.id);
      
//       setIsConnected(false)
//     });

//     socket.on("participants-list", (data: Participant[]) => setParticipants(data));
//     // socket.on("chat-history", (data: ChatMessage[]) =>  setMessages(data));
//     socket.on("chat-history", (data: ChatMessage[]) => {
//       console.log("CHAT HISTORY =>", data);

//       setMessages(data);
//     });
//     socket.on("polls-list", (data: Poll[]) => setPolls(data));

//     socket.on("user-joined", (user: Participant) => {
//       setParticipants((prev) => {
//         if (prev.find((p) => p.userId === user.userId)) return prev;
//         return [...prev, user];
//       });
//     });

//     socket.on("user-left", ({ userId: uid }: { userId: string; name: string }) => {
//       setParticipants((prev) => prev.filter((p) => p.userId !== uid));
//     });

//     socket.on("new-message", (msg: ChatMessage) => {
//       console.log("NEW MESSAGE =>", msg);
//       setMessages((prev) => [...prev, msg]);
//     });

//     socket.on("new-poll", (poll: Poll) => {

//       setPolls((prev) => [...prev, poll]);
//     });

//     socket.on("poll-updated", (updated: Poll) => {
//       setPolls((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
//     });

//     socket.on("poll-closed", (updated: Poll) => {
//       setPolls((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
//     });

//     socket.on("meeting-started", () => onMeetingStarted?.());
//     socket.on("meeting-ended", () => onMeetingEnded?.());

//     return () => {
//       socket.emit("leave-room", { meetingId, userId });
//       socket.disconnect();
//     };
//   }, [meetingId, userId, name, role]);

//   const sendMessage = useCallback(
//     (message: string, type: "text" | "question" | "answer" = "text", replyTo?: string) => {
//       socketRef.current?.emit("send-message", { message, type, replyTo });
//     },
//     []
//   );

//   const createPoll = useCallback((question: string, options: string[]) => {
//     socketRef.current?.emit("create-poll", { question, options });
//   }, []);

//   const votePoll = useCallback((pollId: string, optionIndex: number) => {
//     socketRef.current?.emit("vote-poll", { pollId, optionIndex });
//   }, []);

//   const closePoll = useCallback((pollId: string) => {
//     socketRef.current?.emit("close-poll", { pollId });
//   }, []);

//   const startMeeting = useCallback(() => {
//     socketRef.current?.emit("start-meeting");
//   }, []);

//   const endMeetingSocket = useCallback(() => {
//     socketRef.current?.emit("end-meeting");
//   }, []);

//   return {
//     isConnected,
//     messages,
//     participants,
//     polls,
//     sendMessage,
//     createPoll,
//     votePoll,
//     closePoll,
//     startMeeting,
//     endMeetingSocket,
//     socket: socketRef.current,
//   };
// };
"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Socket } from "socket.io-client";
import { ChatMessage, Participant, Poll, UserRole } from "./meeting.types";
import { socket } from "@/socket/MySocket";

interface UseMeetingSocketOptions {
  meetingId: string;
  userId: string;
  name: string;
  role: UserRole;
  onMeetingStarted?: () => void;
  onMeetingEnded?: () => void;
}

export const useMeetingSocket = ({
  meetingId,
  userId,
  name,
  role,
  onMeetingStarted,
  onMeetingEnded,
}: UseMeetingSocketOptions) => {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // कॉलबैक्स को Ref में स्टोर किया ताकि useEffect बार-बार ट्रिगर न हो
  const callbacksRef = useRef({ onMeetingStarted, onMeetingEnded });
  useEffect(() => {
    callbacksRef.current = { onMeetingStarted, onMeetingEnded };
  }, [onMeetingStarted, onMeetingEnded]);

  useEffect(() => {
    socketRef.current = socket;

    if (!socket.connected) {
      socket.connect();
    }

    const joinRoom = () => {
      console.log("Room Join Request Initiated for Socket ID:", socket.id);
      setIsConnected(true);
      socket.emit("join-room", {
        meetingId,
        userId,
        name,
        role,
      });
    };

    if (socket.connected) {
      joinRoom();
    } else {
      socket.on("connect", joinRoom);
    }

    const handleDisconnect = () => {
      console.log("Disconnected socket:", socket.id);
      setIsConnected(false);
    };

    socket.on("disconnect", handleDisconnect);

    // इवेंट लिसनर्स
    socket.on("participants-list", (data: Participant[]) => setParticipants(data));
    
    socket.on("chat-history", (data: ChatMessage[]) => {
      console.log("CHAT HISTORY RECEIVED =>", data);
      setMessages(data || []);
    });

    socket.on("polls-list", (data: Poll[]) => setPolls(data));

    socket.on("user-joined", (user: Participant) => {
      setParticipants((prev) => {
        if (prev.find((p) => p.userId === user.userId)) return prev;
        return [...prev, user];
      });
    });

    socket.on("user-left", ({ userId: uid }: { userId: string; name: string }) => {
      setParticipants((prev) => prev.filter((p) => p.userId !== uid));
    });

    socket.on("new-message", (msg: ChatMessage) => {
      console.log("NEW MESSAGE RECEIVED =>", msg);
      setMessages((prev) => {
        // डुप्लीकेट मैसेजेस को रोकने के लिए चेक
        if (msg._id && prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });

    socket.on("new-poll", (poll: Poll) => {
      setPolls((prev) => [...prev, poll]);
    });

    socket.on("poll-updated", (updated: Poll) => {
      setPolls((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    });

    socket.on("poll-closed", (updated: Poll) => {
      setPolls((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    });

    socket.on("meeting-started", () => callbacksRef.current.onMeetingStarted?.());
    socket.on("meeting-ended", () => callbacksRef.current.onMeetingEnded?.());

    // क्लीनअप टियरडाउन
    return () => {
      socket.emit("leave-room", { meetingId, userId });
      socket.off("connect", joinRoom);
      socket.off("disconnect", handleDisconnect);
      socket.off("participants-list");
      socket.off("chat-history");
      socket.off("polls-list");
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("new-message");
      socket.off("new-poll");
      socket.off("poll-updated");
      socket.off("poll-closed");
      socket.off("meeting-started");
      socket.off("meeting-ended");
    };
  }, [meetingId, userId, name, role]); // यहाँ से कॉलबैक्स हटा दिए गए हैं ताकि बार-बार कनेक्शन रीसेट न हो

  const sendMessage = useCallback(
    (message: string, type: "text" | "question" | "answer" = "text", replyTo?: string) => {
      if (!socketRef.current) return;
      
      // मुकम्मल पेलोड स्ट्रक्चर ताकि सर्वर डेटा स्टोर कर सके
      const messagePayload = {
        meetingId,
        senderId: userId,
        senderName: name,
        senderRole: role,
        message,
        type,
        replyTo,
        timestamp: new Date().toISOString()
      };
console.log("messagePayload : ",messagePayload);

      socketRef.current.emit("send-message", messagePayload);
    },
    [meetingId, userId, name, role]
  );

  const createPoll = useCallback((question: string, options: string[]) => {
    socketRef.current?.emit("create-poll", { question, options });
  }, []);

  const votePoll = useCallback((pollId: string, optionIndex: number) => {
    socketRef.current?.emit("vote-poll", { pollId, optionIndex });
  }, []);

  const closePoll = useCallback((pollId: string) => {
    socketRef.current?.emit("close-poll", { pollId });
  }, []);

  const startMeeting = useCallback(() => {
    socketRef.current?.emit("start-meeting");
  }, []);

  const endMeetingSocket = useCallback(() => {
    socketRef.current?.emit("end-meeting");
  }, []);

  return {
    isConnected,
    messages,
    participants,
    polls,
    sendMessage,
    createPoll,
    votePoll,
    closePoll,
    startMeeting,
    endMeetingSocket,
    socket: socketRef.current,
  };
};