import UniverseRepository from "../repository/UniverseRepository.js";
import logger from "../utils/logger.js";

class UniverseService {
  constructor() {
    this.universeRepository = new UniverseRepository();
  }

  async createUniverse({ title, rules, creator }) {
    try {
      // Input validation
      if (!title || typeof title !== "string" || !title.trim()) {
        throw new Error(
          "Universe title is required and must be a non-empty string"
        );
      }
      if (!creator) {
        throw new Error("Creator is required");
      }

      const universe = await this.universeRepository.createUniverse({
        title: title.trim(),
        rules,
        creator,
        participants: [creator],
      });
      return universe;
    } catch (error) {
      logger.error("Error in createUniverse service:", error);
      throw new Error(error.message || "Failed to create universe");
    }
  }

  async getUniverses(userId) {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }
      const universes =
        await this.universeRepository.fetchUniversesByParticipant(userId);
      return universes;
    } catch (error) {
      logger.error("Error in getUniverses service:", error);
      throw new Error(error.message || "Failed to fetch universes");
    }
  }

  async deleteUniverse(universeId, userId) {
    try {
      if (!universeId) {
        throw new Error("Universe ID is required");
      }
      if (!userId) {
        throw new Error("User ID is required");
      }
      const universe = await this.universeRepository.getUniverseById(
        universeId
      );
      if (!universe) {
        throw new Error("Universe not found");
      }
      if (
        (universe.creator._id || universe.creator).toString() !==
        userId.toString()
      ) {
        logger.warn(
          `User ${userId} is not authorized to delete universe ${universeId}`
        );
        throw new Error("Unauthorized to update this universe");
      }
      const deletedUniverse = await this.universeRepository.deleteUniverse(
        universeId, userId
      );
      return deletedUniverse;
    } catch (error) {
      logger.error("Error in deleteUniverse service:", error);
      throw new Error(error.message || "Failed to delete universe");
    }
  }

  async updateUniverseTitle(universeId, userId, newTitle) {
    try {
      if (!universeId) {
        throw new Error("Universe ID is required");
      }
      if (!userId) {
        throw new Error("User ID is required");
      }
      if (!newTitle || typeof newTitle !== "string" || !newTitle.trim()) {
        throw new Error("New title is required and must be a non-empty string");
      }
      const universe = await this.universeRepository.getUniverseById(
        universeId
      );
      if (!universe) {
        throw new Error("Universe not found");
      }
      if (
        (universe.creator._id || universe.creator).toString() !==
        userId.toString()
      ) {
        logger.warn(
          `User ${userId} is not authorized to update universe ${universeId}`
        );
        throw new Error("Unauthorized to update this universe");
      }

      const updatedUniverse = await this.universeRepository.updateUniverseTitle(
        universeId,
        userId,
        newTitle.trim()
      );
      return updatedUniverse;
    } catch (error) {
      logger.error("Error in updateUniverseTitle service:", error);
      throw new Error(error.message || "Failed to update universe title");
    }
  }
}

export default UniverseService;
