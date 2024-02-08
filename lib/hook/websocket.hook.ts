// TODO: online count hooks
import { io } from "socket.io-client";

export const useWebSocket = () => {
  const socket = io(`http://localhost:3001`, {
    transports: ["websocket"],
    path: "/api/ws/socket",
    addTrailingSlash: false,
  });

  socket.on("connect_error", async (err) => {
    console.log(`connect_error due to ${err.message}`);
    await fetch("http://localhost:3000/api/ws/socket");
  });

  return socket;
};
