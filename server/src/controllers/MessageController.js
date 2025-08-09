import MessageService from "../services/MessageService.js";
import logger from "../utils/logger.js";
import {io} from '../index.js';

const messageService = new MessageService();

const createMessage = async (req, res) => {
  try {
    const { universeId } = req.params;
    const { text } = req.body;
    const file = req.file;

    const message = await messageService.createMessage({
      universeId,
      sender: req.user._id,
      text,
      file
    });

    io.to(universeId).emit('new-message', message);
    logger.info(`Message created in universe ${universeId} by user ${req.user._id}`);
    return res.status(201).json({
      message: "Message sent successfully",
      data: message
    });
  } catch (error) {
    logger.error("Error in createMessage controller:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getMessagesForUniverse = async (req, res) => {
  try {
    const { universeId } = req.params;
    const messages = await messageService.getAllMessagesForUniverse(universeId);

    return res.status(200).json({
      message: "Messages fetched successfully",
      data: messages
    });
  } catch (error) {
    logger.error("Error in getMessagesForUniverse controller:", error);
    return res.status(500).json({ message: error.message });
  }
};

const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { text } = req.body;

    const updatedMessage = await messageService.editMessage(
      messageId,
      req.user._id,
      text
    );

    return res.status(200).json({
      message: "Message updated successfully",
      data: updatedMessage
    });
  } catch (error) {
    logger.error("Error in editMessage controller:", error);
    return res.status(500).json({ message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    await messageService.deleteMessage(messageId, req.user._id);

    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    logger.error("Error in deleteMessage controller:", error);
    return res.status(500).json({ message: error.message });
  }
};

export {
    createMessage,
    getMessagesForUniverse,
    editMessage,
    deleteMessage
}
