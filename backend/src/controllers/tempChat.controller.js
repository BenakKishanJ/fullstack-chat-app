import TempChatSession from "../models/tempChatSession.model.js";
import TempMessage from "../models/tempMessage.model.js";
import { v4 as uuidv4 } from "uuid";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const createTempChat = async (req, res) => {
  try {
    const { creatorName } = req.body;

    if (!creatorName || creatorName.trim() === "") {
      return res.status(400).json({ error: "Creator name is required" });
    }

    const sessionId = uuidv4();
    
    const tempSession = new TempChatSession({
      sessionId,
      creatorName: creatorName.trim(),
    });

    await tempSession.save();

    res.status(201).json({
      sessionId,
      shareLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/join/${sessionId}`,
      creatorName: creatorName.trim(),
    });
  } catch (error) {
    console.log("Error in createTempChat controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const joinTempChat = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { participantName } = req.body;

    if (!participantName || participantName.trim() === "") {
      return res.status(400).json({ error: "Participant name is required" });
    }

    const session = await TempChatSession.findOne({ 
      sessionId, 
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      return res.status(404).json({ error: "Chat session not found or expired" });
    }

    // Update session with participant info
    session.participantName = participantName.trim();
    await session.save();

    res.status(200).json({
      sessionId,
      creatorName: session.creatorName,
      participantName: participantName.trim(),
      joined: true,
    });
  } catch (error) {
    console.log("Error in joinTempChat controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTempChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await TempChatSession.findOne({ 
      sessionId, 
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      return res.status(404).json({ error: "Chat session not found or expired" });
    }

    res.status(200).json({
      sessionId: session.sessionId,
      creatorName: session.creatorName,
      participantName: session.participantName,
      isActive: session.isActive,
      createdAt: session.createdAt,
    });
  } catch (error) {
    console.log("Error in getTempChatSession controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTempMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Verify session exists and is active
    const session = await TempChatSession.findOne({ 
      sessionId, 
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      return res.status(404).json({ error: "Chat session not found or expired" });
    }

    const messages = await TempMessage.find({ sessionId })
      .sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getTempMessages controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendTempMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { text, image, senderName, senderType } = req.body;

    // Verify session exists and is active
    const session = await TempChatSession.findOne({ 
      sessionId, 
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      return res.status(404).json({ error: "Chat session not found or expired" });
    }

    if (!text && !image) {
      return res.status(400).json({ error: "Message must contain text or image" });
    }

    if (!senderName || !senderType) {
      return res.status(400).json({ error: "Sender information is required" });
    }

    const newMessage = new TempMessage({
      sessionId,
      senderName,
      senderType,
      text,
      image,
    });

    await newMessage.save();

    // Emit message to all participants in the session
    const receiverSocketId = senderType === "creator" 
      ? session.participantSocketId 
      : session.creatorSocketId;

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newTempMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendTempMessage controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const leaveTempChat = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userType } = req.body; // "creator" or "participant"

    const session = await TempChatSession.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ error: "Chat session not found" });
    }

    // Mark session as inactive and delete all messages
    session.isActive = false;
    await session.save();

    // Delete all messages for this session
    await TempMessage.deleteMany({ sessionId });

    // Notify the other participant if they're still connected
    const otherSocketId = userType === "creator" 
      ? session.participantSocketId 
      : session.creatorSocketId;

    if (otherSocketId) {
      io.to(otherSocketId).emit("chatSessionEnded", { sessionId });
    }

    res.status(200).json({ message: "Successfully left chat session" });
  } catch (error) {
    console.log("Error in leaveTempChat controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateSocketId = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { socketId, userType } = req.body;

    const session = await TempChatSession.findOne({ 
      sessionId, 
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      return res.status(404).json({ error: "Chat session not found or expired" });
    }

    if (userType === "creator") {
      session.creatorSocketId = socketId;
    } else if (userType === "participant") {
      session.participantSocketId = socketId;
    }

    await session.save();

    res.status(200).json({ message: "Socket ID updated successfully" });
  } catch (error) {
    console.log("Error in updateSocketId controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};