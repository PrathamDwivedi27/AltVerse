import User from "../models/userSchema.js";
import logger from "../utils/logger.js";

class UserRepository {
  constructor() {
    this.userModel = User;
  }

  async findByEmail(email) {
    try {
      const user = await this.userModel.findOne({ email: email }).exec();
      if (!user) {
        logger.warn(`User with email ${email} not found`);
        return null;
      }
      return user;
    } catch (error) {
      logger.error(`Error in UserRepository.findByEmail: ${error.message}`);
      throw new Error("Database error occurred while finding user by email");
    }
  }

  async findById(id) {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        logger.warn(`User with ID ${id} not found`);
        return null;
      }
      return user;
    } catch (error) {
      logger.error(`Error in UserRepository.findById: ${error.message}`);
      throw new Error("Database error occurred while finding user by ID");
    }
  }

  async createUser(userData) {
    try {
      const user = await this.userModel.create(userData);
      return user;
    } catch (error) {
      logger.error(`Error in UserRepository.createUser: ${error.message}`);
      throw new Error("Database error occurred while creating user");
    }
  }

  async updateAvatar(userId, avatarUrl) {
    try {
      const user = await this.userModel
        .findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true })
        .exec();
      if (!user) {
        logger.warn(`User with ID ${userId} not found for avatar update`);
        return null;
      }
      return user;
    } catch (error) {
      logger.error(`Error in UserRepository.updateAvatar: ${error.message}`);
      throw new Error("Database error occurred while updating user avatar");
    }
  }

  async updateUsername(userId, newName) {
    try {
      const user = await this.userModel
        .findByIdAndUpdate(userId, { username: newName }, { new: true })
        .exec();
      if (!user) {
        logger.warn(`User with ID ${userId} not found for name update`);
        return null;
      }
      return user;
    } catch (error) {
      logger.error(`Error in UserRepository.updateUserName: ${error.message}`);
      throw new Error("Database error occurred while updating user name");
    }
  }

  async isUsernameTaken(username) {
    try {
      const existing = await this.userModel.findOne({ username }).exec();
      return !!existing; // true if username exists
    } catch (error) {
      logger.error(`Error in UserRepository.isUsernameTaken: ${error.message}`);
      throw new Error(
        "Database error occurred while checking username availability"
      );
    }
  }

  async addUniverseToCreated(userId, universeId) {
    try {
      return await this.userModel.findByIdAndUpdate(userId, {
        $addToSet: { createdUniverses: universeId },
      });
    } catch (err) {
      logger.error('Error adding universe to created:', err);
      throw err;
    }
  }

  async addUniverseToJoined(userId, universeId) {
    try {
      return await this.userModel.findByIdAndUpdate(userId, {
        $addToSet: { joinedUniverses: universeId },
      });
    } catch (err) {
      logger.error('Error adding universe to joined:', err);
      throw err;
    }
  }

  async removeJoinedUniverse(userId, universeId) {
    try {
      const user=await this.userModel.findByIdAndUpdate(userId, {
        $pull: { joinedUniverses: universeId },
      });
      return user;
    } catch (err) {
      logger.error('Error removing joined universe:', err);
      throw err;
    }
  }
  
}

export default UserRepository;
