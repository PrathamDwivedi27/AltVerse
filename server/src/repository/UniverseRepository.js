import Universe from '../models/universeSchema.js';
import logger from '../utils/logger.js';
import Event from '../models/eventSchema.js';
import LoreEntry from '../models/loreEntrySchema.js';

class UniverseRepository {
    constructor() {
        this.universeModel = Universe;
    }

    async createUniverse(universeData) {
        if (!universeData || !universeData.title || !universeData.creator) {
            logger.warn('Missing required universe data');
            throw new Error('Universe data with title and creator is required');
        }
        try {
            const universe = await this.universeModel.create(universeData);
            return universe;
        } catch (error) {
            logger.error('Error creating universe:', error);
            throw error;
        }
    }

    async getUniverseById(universeId) {
        if (!universeId) {
            logger.warn('Universe ID not provided');
            throw new Error('Universe ID is required');
        }
        try {
            const universe = await this.universeModel.findById(universeId)
                .populate('creator', 'username')
                .populate('participants', 'username')
                .populate('timeline')
                .populate('lore');
            if (!universe) {
                logger.warn(`Universe not found for ID: ${universeId}`);
                throw new Error('Universe not found');
            }
            return universe;
        } catch (error) {
            logger.error('Error fetching universe by ID:', error);
            throw error;
        }
    }

    async updateUniverseTitle(universeId, userId, newTitle) {
        if (!universeId || !userId || !newTitle) {
            logger.warn('Missing parameters for updating universe title');
            throw new Error('Universe ID, user ID, and new title are required');
        }
        try {
            const universe = await this.universeModel.findOneAndUpdate(
                { _id: universeId, creator: userId },
                { title: newTitle },
                { new: true }
            );
            if (!universe) {
                logger.warn(`Universe not found or user not authorized: ${universeId}`);
                throw new Error('Universe not found or user not authorized');
            }
            return universe;
        } catch (error) {
            logger.error('Error updating universe title:', error);
            throw error;
        }
    }

    async deleteUniverse(universeId, userId) {
        if (!universeId || !userId) {
            logger.warn('Missing parameters for deleting universe');
            throw new Error('Universe ID and user ID are required');
        }
        try {
            const universe = await this.universeModel.findOneAndDelete({ _id: universeId, creator: userId });
            if (!universe) {
                logger.warn(`Universe not found or user not authorized: ${universeId}`);
                throw new Error('Universe not found or user not authorized');
            }
            return universe;
        } catch (error) {
            logger.error('Error deleting universe:', error);
            throw error;
        }
    }

    async fetchUniversesByParticipant(userId) {
        if (!userId) {
            logger.warn('User ID not provided for fetching universes');
            throw new Error('User ID is required');
        }
        try {
            const universes = await this.universeModel.find({ participants: userId })
                .populate('creator', 'username')
                .populate('participants', 'username');
            if (!universes || universes.length === 0) {
                logger.info(`No universes found for participant: ${userId}`);
                return [];
            }
            return universes;
        } catch (error) {
            logger.error('Error fetching universes by participant:', error);
            throw error;
        }
    }

    async findByTitleAndCreator(title, creatorId) {
        return await this.universeModel.findOne({ title, creator: creatorId });
    }

    async removeParticipant(universeId, userId) {
        if (!universeId || !userId) {
            logger.warn('Missing parameters for removing participant from universe');
            throw new Error('Universe ID and user ID are required');
        }
        try {
            const universe = await this.universeModel.findByIdAndUpdate(
                universeId,
                { $pull: { participants: userId } },
                { new: true }
            );
            if (!universe) {
                logger.warn(`Universe not found for ID: ${universeId}`);
                throw new Error('Universe not found');
            }
            return universe;
        } catch (error) {
            logger.error('Error removing participant from universe:', error);
            throw error;
        }
    }

    async updateUniverseTimeline(universeId, newEventId) {
        try {
            const updatedUniverse = await this.universeModel.findByIdAndUpdate(
                universeId,
                { $push: { timeline: newEventId } },
                { new: true }
            );
            return updatedUniverse;
        } catch (error) {
            logger.error(`Error updating timeline for universe ID: ${universeId}`, error);
            throw error;
        }
    }

    /**
     * Adds a new event's map data to a universe's mapData.events array.
     * @param {string} universeId - The ID of the universe to update.
     * @param {object} mapEventData - The data for the new map event pin.
     * @returns {Promise<Document>} The updated universe document.
     */
    async addEventToMap(universeId, mapEventData) {
        try {
            // Use findByIdAndUpdate with $push to efficiently add the new event to the mapData.events array
            const updatedUniverse = await this.universeModel.findByIdAndUpdate(
                universeId,
                { $push: { "mapData.events": mapEventData } },
                { new: true } // This option returns the document after the update has been applied
            );
            return updatedUniverse;
        } catch (error) {
            logger.error(`Error adding event to map for universe ID: ${universeId}`, error);
            throw error;
        }
    }
};

export default UniverseRepository;