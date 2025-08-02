import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserService from "../services/UserService.js";
import {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL} from "./server-config.js";
import logger from "../utils/logger.js";

const userService = new UserService();

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await userService.loginOrRegisterUser({
          googleId: profile.id,
          email: profile.emails[0].value,
        });
        return done(null, user);
      } catch (error) {
        logger.error(`Error in GoogleStrategy callback: ${error.message}`);
        return done(error, null);
      }
    }

  )
);

passport.serializeUser((user, done) => {
  done(null, user._id); // Only store user ID in session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.getUserById(id);
    if (!user) {
      return done(new Error("User not found"), null);
    }
    done(null, user);
  } catch (error) {
    logger.error(`Error in passport.deserializeUser: ${error.message}`);
    done(error, null);
  }
}
);