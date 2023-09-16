import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  code: { Type: String, unique: true, required: true },
  purchase_datetime: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  purchaser: { type: String, unique: true, required: true },
});

export const TicketModel = mongoose.model("Ticket", TicketSchema);
