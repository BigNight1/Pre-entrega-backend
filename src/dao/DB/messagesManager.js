import { messageModel } from "../models/messagesSchema.js";

class MessageManager {
  async saveMessage(sender, content) {
    try {
      const newMessage = await messageModel.create({
        sender,
        content,
      });
      console.log("Mensaje guardado en la base de datos:", newMessage);
      return newMessage;
    } catch (error) {
      console.log("Error al guardar el mensaje en la base de datos:", error);
      return null;
    }
  }

  async getMessages() {
    try {
      const messages = await messageModel.find().sort({ createdAt: 1 });
      return messages;
    } catch (error) {
      console.log("Error al obtener los mensajes:", error);
      return null;
    }
  }
}

export default MessageManager;
