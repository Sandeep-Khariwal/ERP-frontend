import { io , Socket } from "socket.io-client";

class MySocket {
    public socket:any;
    public URL:string;

  constructor(){
    // this.URL = "https://flickerchat-backend.onrender.com";
    this.URL = "http://localhost:8080";

    this.socket = io(this.URL,{autoConnect:true})

    this.socket.on("connect_error", (err:any) => {
    if (err.message === "invalid username") {
      console.log("Error from server : ", err); 
    }
    });
  }
}

export default MySocket