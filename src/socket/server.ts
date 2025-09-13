// socket/mySocket.ts (from previous step)
import { io, Socket } from "socket.io-client";

class MySocket {
  public socket: Socket;
  public URL: string;

  constructor() {
    this.URL = "http://localhost:8080"; // Your backend URL

    this.socket = io(this.URL, {
      autoConnect: false
    });

    this.setupListeners();
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  on(eventName: string, callback: (...args: any[]) => void) {
    this.socket.on(eventName, callback);
  }

  off(eventName: string, callback?: (...args: any[]) => void) {
    this.socket.off(eventName, callback);
  }

  private setupListeners() {
    this.socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO", this.socket.id);
    });

    this.socket.on("disconnect", () => {
      console.log("🔌 Disconnected");
    });

    this.socket.on("connect_error", (err: any) => {
      console.error("❌ Connection error:", err.message);
    });
  }
}

export default MySocket;
