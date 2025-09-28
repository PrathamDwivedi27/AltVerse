import LoreEntry from '../models/loreEntrySchema.js';
import logger from '../utils/logger.js';

/**
 * @description Repository for abstracting database operations for the LoreEntry model.
 */
class LoreRepository {
    /**
     * Creates a new lore entry in the database.
     * @param {object} loreData - The data for the new lore entry.
     * @returns {Promise<Document>} The newly created lore document.
     */
    async create(loreData) {
        try {
            const newLore = new LoreEntry(loreData);
            await newLore.save();
            return newLore;
        } catch (error) {
            logger.error("Error in LoreRepository create:", error);
            throw error;
        }
    }

    /**
     * Finds all lore entries for a specific universe, sorted by creation date.
     * @param {string} universeId - The ID of the universe.
     * @returns {Promise<Array<Document>>} A list of lore documents.
     */
    async findByUniverse(universeId) {
        try {
            // Find all lore entries and sort them by creation date (oldest first) to build a proper history.
            return await LoreEntry.find({ universeId }).sort({ createdAt: 'asc' });
        } catch (error) {
            logger.error(`Error in LoreRepository findByUniverse for universeId ${universeId}:`, error);
            throw error;
        }
    }
}

export default LoreRepository;

