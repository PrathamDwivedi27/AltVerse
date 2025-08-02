import UserService from "../services/UserService.js";
import logger from "../utils/logger.js";

const userService = new UserService();

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      message: "User retrieved successfully",
    });
  } catch (error) {
    logger.error(`Error in UserController.getCurrentUser: ${error.message}`);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({ message: "Avatar URL is required" });
    }

    const updatedUser = await userService.updateUserAvatar(userId, avatar);
    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "User not found for avatar update" });
    }

    return res.status(200).json({
      message: "User avatar updated successfully",
      user: {
        email: updatedUser.email,
        username: updatedUser.username,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    logger.error(`Error in UserController.updateUserAvatar: ${error.message}`);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateUsername = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "username field is required" });
    }

    const updatedUser = await userService.updateUsername(userId, username);
    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "User not found for username update" });
    }

    return res.status(200).json({
      message: "Username updated successfully",
      user: {
        email: updatedUser.email,
        username: updatedUser.username,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    logger.error(`Error in UserController.updateUsername: ${error.message}`);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      logger.error(`Error in UserController.logout: ${err.message}`);
      return res
        .status(500)
        .json({ message: "Logout failed", error: err.message });
    }
    return res.status(200).json({ message: "Logged out successfully" });
  });
};

export { 
    getCurrentUser, 
    updateUserAvatar, 
    updateUsername, 
    logout 
};
