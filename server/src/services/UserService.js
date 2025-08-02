import UserRepository from "../repository/UserRepository.js";
import logger from "../utils/logger.js";
import { generateAvatar } from "../utils/userUtils/randomAvatar.js";
import {generateRandomUsername} from "../utils/userUtils/randomUsername.js";


class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }




}
