import UserRepository from "../repository/UserRepository.js";
import logger from "../utils/logger.js";
import { generateAvatar } from "../utils/userUtils/randomAvatar.js";
import { generateRandomUsername } from "../utils/userUtils/randomUsername.js";

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async loginOrRegisterUser({ googleId, email }) {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        const username = generateRandomUsername();
        const avatar = generateAvatar(email);
        const newUser = await this.userRepository.createUser({
          googleId,
          email,
          username,
          avatar,
        });
        logger.info(`New user : ${newUser}`);
        return newUser;
      }

      return user;
    } catch (error) {
      logger.error(
        `Error in UserService.loginOrRegisterUser: ${error.message}`
      );
      throw new Error("Error occurred while logging in or registering user");
    }
  }

  async getUserById(id) {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        logger.warn(`User with ID ${id} not found`);
        return null;
      }
      return user;
    } catch (error) {
      logger.error(`Error in UserService.getUserById: ${error.message}`);
      throw new Error("Error occurred while retrieving user by ID");
    }
  }

  async updateUserAvatar(userId, avatarUrl) {
    try {
      const updatedUser = await this.userRepository.updateAvatar(
        userId,
        avatarUrl
      );
      if (!updatedUser) {
        logger.warn(`User with ID ${userId} not found for avatar update`);
        return null;
      }
      return updatedUser;
    } catch (error) {
      logger.error(`Error in UserService.updateUserAvatar: ${error.message}`);
      throw new Error("Error occurred while updating user avatar");
    }
  }

  async updateUsername(userId, newUsername) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        logger.warn(`User with ID ${userId} not found for username update`);
        return null;
      }
      const isTaken = await this.userRepository.isUsernameTaken(newUsername);
      if (isTaken) throw new Error("Username already taken");

      const updatedUser = await this.userRepository.updateUsername(
        userId,
        newUsername
      );
      return updatedUser;
    } catch (error) {
      logger.error(`Error in UserService.updateUsername: ${error.message}`);
      throw new Error("Error occurred while updating username");
    }
  }
}

export default UserService;
