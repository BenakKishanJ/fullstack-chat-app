import mongoose from "mongoose";

const tempMessageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      ref: "TempChatSession",
    },
    senderName: {
      type: String,
      required: true,
    },
    senderType: {
      type: String,
      enum: ["creator", "participant"],
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Auto-delete messages when session expires
tempMessageSchema.index({ sessionId: 1 });
tempMessageSchema.index({ timestamp: 1 }, { expireAfterSeconds: 86400 }); // 24 hours

const TempMessage = mongoose.model("TempMessage", tempMessageSchema);

export default TempMessage;