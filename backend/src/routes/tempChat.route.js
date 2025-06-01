import express from "express";
import { 
  createTempChat, 
  joinTempChat, 
  getTempChatSession,
  getTempMessages, 
  sendTempMessage, 
  leaveTempChat,
  updateSocketId 
} from "../controllers/tempChat.controller.js";

const router = express.Router();

router.post("/create", createTempChat);
router.post("/join/:sessionId", joinTempChat);
router.get("/session/:sessionId", getTempChatSession);
router.get("/messages/:sessionId", getTempMessages);
router.post("/send/:sessionId", sendTempMessage);
router.post("/leave/:sessionId", leaveTempChat);
router.post("/update-socket/:sessionId", updateSocketId);

export default router;