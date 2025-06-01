import { Server } from "socket.io";
import http from "http";
import express from "express";
import TempChatSession from "../models/tempChatSession.model.js";
import TempMessage from "../models/tempMessage.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production" 
      ? true 
      : ["http://localhost:5173", "http://localhost:5174"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}
const tempChatSocketMap = {}; // {sessionId: {creator: socketId, participant: socketId}}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  const sessionId = socket.handshake.query.sessionId;
  const userType = socket.handshake.query.userType; // "creator" or "participant"

  // Handle regular authenticated users
  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // Handle temporary chat users
  if (sessionId && userType) {
    handleTempChatConnection(socket, sessionId, userType);
  }

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    
    // Handle regular user disconnect
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    // Handle temp chat user disconnect
    if (sessionId && userType) {
      handleTempChatDisconnect(sessionId, userType);
    }
  });
});

async function handleTempChatConnection(socket, sessionId, userType) {
  try {
    const session = await TempChatSession.findOne({ 
      sessionId, 
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      socket.emit("error", "Chat session not found or expired");
      return;
    }

    // Initialize session in socket map if not exists
    if (!tempChatSocketMap[sessionId]) {
      tempChatSocketMap[sessionId] = {};
    }

    // Store socket connection
    tempChatSocketMap[sessionId][userType] = socket.id;

    // Update database with socket ID
    if (userType === "creator") {
      session.creatorSocketId = socket.id;
    } else if (userType === "participant") {
      session.participantSocketId = socket.id;
    }
    await session.save();

    // Join socket room for this session
    socket.join(sessionId);

    // Notify the other participant that someone joined
    socket.to(sessionId).emit("userJoined", {
      userType,
      userName: userType === "creator" ? session.creatorName : session.participantName
    });

    socket.emit("connectedToTempChat", {
      sessionId,
      userType,
      otherUserConnected: userType === "creator" ? !!session.participantSocketId : !!session.creatorSocketId
    });

  } catch (error) {
    console.log("Error handling temp chat connection:", error);
    socket.emit("error", "Failed to connect to chat session");
  }
}

async function handleTempChatDisconnect(sessionId, userType) {
  try {
    // Remove from socket map
    if (tempChatSocketMap[sessionId]) {
      delete tempChatSocketMap[sessionId][userType];
      
      // If both users disconnected, clean up the session
      if (Object.keys(tempChatSocketMap[sessionId]).length === 0) {
        delete tempChatSocketMap[sessionId];
        
        // Mark session as inactive and clean up
        await TempChatSession.findOneAndUpdate(
          { sessionId },
          { isActive: false }
        );
        await TempMessage.deleteMany({ sessionId });
      }
    }

    // Update database
    const session = await TempChatSession.findOne({ sessionId });
    if (session) {
      if (userType === "creator") {
        session.creatorSocketId = null;
      } else if (userType === "participant") {
        session.participantSocketId = null;
      }
      await session.save();

      // Notify the other user about disconnection
      io.to(sessionId).emit("userDisconnected", { userType });
    }

  } catch (error) {
    console.log("Error handling temp chat disconnect:", error);
  }
}

export { io, app, server };
