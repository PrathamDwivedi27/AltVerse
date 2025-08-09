import Message from "../models/messageSchema.js";
import logger from "../utils/logger.js";

class MessageRepository {
    constructor() {
        this.messageModel= Message;
    }

    async createMessage(data){
        try {
            const message = await this.messageModel.create(data);
            return message;
        } catch (error) {
            logger.error("Error creating message:", error);
            throw error;
        }
    }

    async getAllMessagesForUniverse(universeId) {
        try {
            const messages = await this.messageModel.find({ universeId })
                .populate('sender', 'username avatar ')
                .sort({ createdAt: 1 })
                .lean(); // Use lean for better performance
            return messages;
        } catch (error) {
            logger.error("Error fetching messages:", error);
            throw error;
        }
    }

    async getMessageById(messageId) {
        try {
            const message = await this.messageModel.findById(messageId)
                .populate('sender', 'username avatar');
            return message;
        } catch (error) {
            logger.error("Error fetching message by ID:", error);
            throw error;
        }
    }

    async updateMessage(messageId, updateData) {
        try {
            const updatedMessage = await this.messageModel.findByIdAndUpdate(
                messageId,
                updateData,
                { new: true }
            ).populate('sender', 'username avatar');
            return updatedMessage;
        } catch (error) {
            logger.error("Error updating message:", error);
            throw error;
        }
    }

    async deleteMessage(messageId) {
        try {
            const deletedMessage = await this.messageModel.findByIdAndDelete(messageId);
            return deletedMessage;
        } catch (error) {
            logger.error("Error deleting message:", error);
            throw error;
        }
    }

}

export default MessageRepository;