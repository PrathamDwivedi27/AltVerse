import EventService from "../services/EventService.js";
import logger from "../utils/logger.js";


const eventService = new EventService();

const createEvent = async (req, res) => {
    const { universeId, prompt } = req.body;
    const submittedBy = req.user._id;

    if (!universeId || !prompt) {
        logger.warn("Missing required fields: universeId or prompt");
        return res.status(400).json({ error: "Universe ID and prompt are required" });
    }

    try {
        const newEvent = await eventService.createEvent({ universeId, prompt, submittedBy });
        return res.status(201).json(newEvent);
    } catch (error) {
        logger.error("Error creating event:", error);
        return res.status(500).json({ error: "Failed to create event" });
    }
}

export {createEvent};