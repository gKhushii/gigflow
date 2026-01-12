import { io } from "socket.io-client";

const socket = io("https://gigflow-backend-cuvy.onrender.com", {
  withCredentials: true
});

export default socket;
