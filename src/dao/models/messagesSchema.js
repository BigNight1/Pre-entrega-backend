import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const messageModel = mongoose.model("messages", messageSchema);
