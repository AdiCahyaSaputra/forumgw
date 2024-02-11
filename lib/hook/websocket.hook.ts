// TODO: online count hooks
import { io } from "socket.io-client";

export const useWebSocket = () => {
  const socket = io(`${process.env.SERVER_SOCKET_URL}`, {
    transports: ["websocket"],
    path: "/api/ws/socket",
    addTrailingSlash: false,
  });

  socket.on("connect_error", async (err) => {
    console.log(`connect_error due to ${err.message}`);
    await fetch(`${process.env.BASE_SOCKET_URL}/api/ws/socket`);
  });

  return socket;
};
