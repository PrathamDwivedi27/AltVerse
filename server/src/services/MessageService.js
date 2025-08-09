import MessageRepository from "../repository/MessageRepository.js";
import logger from "../utils/logger.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import { CLOUDINARY_FOLDER } from "../config/server-config.js";

class MessageService {
  constructor() {
    this.messageRepository = new MessageRepository();
  }

  async createMessage({ universeId, sender, text = "", file }) {
    try {
      let mediaUrl = "";
      let mediaPublicId = "";
      let mediaType = "none";
      let type = "text";
      let duration = 0;

      if (file) {
        // Upload from memory buffer
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: file.mimetype.startsWith("audio")
                ? "video" // audio handled as video by Cloudinary
                : "image",
              folder: CLOUDINARY_FOLDER,
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        });

        mediaUrl = uploadResult.secure_url;
        mediaPublicId = uploadResult.public_id;

        if (file.mimetype.startsWith("image")) {
          mediaType = "image";
          type = text ? "mixed" : "image";
        } else if (file.mimetype.startsWith("audio")) {
          mediaType = "audio";
          type = text ? "mixed" : "audio";
          duration = file.duration || 0;
        }
      }

      if (!file && text.trim()) {
        type = "text";
      }

      const messageData = {
        universeId,
        sender,
        type,
        text,
        mediaUrl,
        mediaPublicId,
        mediaType,
        duration,
      };

      return await this.messageRepository.createMessage(messageData);
    } catch (error) {
      logger.error("Error creating message:", error);
      throw error;
    }
  }

  async getAllMessagesForUniverse(universeId) {
    try {
      const allMessages =
        await this.messageRepository.getAllMessagesForUniverse(universeId);

      const groups = {};
      const now = new Date();

      for (const msg of allMessages) {
        if (!msg || !msg.createdAt) continue;

        const msgDate = new Date(msg.createdAt);
        const startOfMsgDate = new Date(
          msgDate.getFullYear(),
          msgDate.getMonth(),
          msgDate.getDate()
        );
        const startOfToday = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const startOfYesterday = new Date(startOfToday);
        startOfYesterday.setDate(startOfToday.getDate() - 1);

        let label;
        if (startOfMsgDate.getTime() === startOfToday.getTime()) {
          label = "Today";
        } else if (startOfMsgDate.getTime() === startOfYesterday.getTime()) {
          label = "Yesterday";
        } else {
          // Format as "08 Aug 2025"
          label = msgDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        }

        if (!groups[label]) {
          groups[label] = [];
        }
        groups[label].push(msg);
      }

      return groups;
    } catch (error) {
      logger.error("Error fetching messages for universe:", error);
      throw error;
    }
  }

  async editMessage(messageId, userId, newText) {
    try {
      const message = await this.messageRepository.getMessageById(messageId);

      if (!message) throw new Error("Message not found");
      if (message.sender._id.toString() !== userId.toString()) {
        throw new Error("You can only edit your own messages");
      }

      const now = new Date();
      const timeDiff = (now - new Date(message.createdAt)) / 1000 / 60; // minutes
      if (timeDiff > 15) {
        throw new Error(
          "You can only edit messages within 15 minutes of sending"
        );
      }

      message.text = newText;
      message.edited = true;

      return await this.messageRepository.updateMessage(messageId, message);
    } catch (error) {
      logger.error("Error editing message:", error);
      throw error;
    }
  }

  async deleteMessage(messageId, userId) {
    try {
      const msg = await this.messageRepository.getMessageById(messageId);
      if (!msg) throw new Error("Message not found");

      // Only sender can delete
      if (msg.sender._id.toString() !== userId.toString()) {
        throw new Error("You can only delete your own messages");
      }

      // Only if within 15 mins
      const now = new Date();
      const diffMinutes = (now - msg.createdAt) / (1000 * 60);
      if (diffMinutes > 15) {
        throw new Error("You can delete messages only within 15 minutes");
      }

      // If media exists in Cloudinary, delete from there
      if (msg.mediaPublicId) {
        await cloudinary.uploader.destroy(msg.mediaPublicId, {
          resource_type:
            msg.mediaType === "audio"
              ? "video"
              : msg.mediaType === "video"
              ? "video"
              : "image",
        });
      }

      return await this.messageRepository.deleteMessage(messageId);
    } catch (error) {
      logger.error("Error deleting message:", error);
      throw error;
    }
  }
}

export default MessageService;
