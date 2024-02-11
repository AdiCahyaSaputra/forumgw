import JoinedUser from "@/lib/interface/JoinedUser";
import { group } from "console";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import type { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer, Server } from "socket.io";

interface SocketServer extends HTTPServer {
  io?: IOServer;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

const handler = async (_: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    return res.status(200).json({
      message: "Socket is already running",
    });
  }

  console.log("Starting socket server on port : ", 3000);

  const port = process.env.PORT || "3000";

  const io = new Server({
    path: "/api/ws/socket",
    addTrailingSlash: false,
    cors: {
      origin: "*",
    },
  }).listen(+port);

  const groups: Record<string, string[]> = {};

  io.on("connect", (socket) => {
    socket.on("join_rooms", (joinedUser: JoinedUser) => {
      console.log(groups);
      joinedUser.rooms.forEach((room_id) => {
        socket.join(room_id);

        if (!groups[room_id]) {
          groups[room_id] = [joinedUser.username];
        }

        if (
          !groups[room_id].find((username) => username === joinedUser.username)
        ) {
          groups[room_id].push(joinedUser.username);
        }

        io.to(room_id).emit("update-online-count", {
          room_id,
          online: groups[room_id].length,
        });
      });

      socket.on("disconnect", () => {
        // TODO: get current user room and splice it from room
        console.log("user disconnect");
      });
    });

    socket.on("user_logout", (loggedOutUsername: string) => {
      console.log("user has been logged out");

      for (const [room_id, users] of Object.entries(groups)) {
        groups[room_id] = users.filter(
          (username) => username !== loggedOutUsername,
        );

        io.to(room_id).emit("update-online-count", {
          room_id,
          online: groups[room_id].length,
        });
      }
    });
  });

  res.socket.server.io = io;
  res.status(201).json({
    message: "Socket is started",
  });
};

export default handler;
