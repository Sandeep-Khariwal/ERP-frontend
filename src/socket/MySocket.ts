// socket.ts
import { io } from "socket.io-client";

// const URL = "http://localhost:9000";
const URL = "https://server.shikshapay.cloud";

export const socket = io(URL, {
  autoConnect: false,
});