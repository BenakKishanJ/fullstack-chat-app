import mongoose from "mongoose";

const tempChatSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    creatorName: {
      type: String,
      required: true,
    },
    creatorSocketId: {
      type: String,
      default: null,
    },
    participantName: {
      type: String,
      default: null,
    },
    participantSocketId: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from creation
    },
  },
  { timestamps: true }
);

// Auto-delete expired sessions
tempChatSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const TempChatSession = mongoose.model("TempChatSession", tempChatSessionSchema);

export default TempChatSession;