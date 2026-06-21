// socket.ts
import { io } from "socket.io-client";

const URL = "http://localhost:8080";
// const URL = "https://server.shikshapay.cloud";

export const socket = io(URL, {
  autoConnect: false,
});