import Event from "../models/eventSchema.js";
import logger from "../utils/logger.js";

class EventRepository {
    constructor() {
        this.eventModel = Event;
    }

    async createEvent(eventData) {
        try {
            const event = await this.eventModel.create(eventData);
            return event;
        } catch (error) {
            logger.error("Error creating event:", error);
            throw error;
        }
    }

    async findRecentEvents(universeId, limit = 10) {
        try {
            const events = await this.eventModel.find({ universeId })
                .sort({ createdAt: -1 })
                .limit(limit)
                .select("prompt aiOutcome.content")
                .lean();
            return events;
        } catch (error) {
            logger.error("Error fetching recent events:", error);
            throw error;
        }
    }
};

export default EventRepository;