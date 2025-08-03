import express from 'express';
import bodyParser from 'body-parser';
import { PORT } from './config/server-config.js';
import { connectDB } from './config/db-config.js';
import logger from './utils/logger.js';
import { SESSION_SECRET } from './config/server-config.js';
import apiRoutes from './routes/index.js';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import './config/passport.js';


const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));


app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false ,   // true in production with https
    httpOnly: true,   // Prevents client-side JavaScript from accessing the cookie
    sameSite: 'lax', // Helps prevent CSRF attacks
   } 
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

connectDB();

app.get('/', (req, res) => {
    res.send('AltVerse Backend has started.');
});

app.use("/api",apiRoutes);

const setup_and_start_server = () => {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}

setup_and_start_server();

const handleServerShutdown=async ()=>{
    try {
        logger.info("Shutting down server...");
        logger.info("Server shutdown complete.");
        await mongoose.connection.close();
        logger.info("Database connection closed.");
        process.exit(0);
    } catch (error) {
        logger.error("Error during server shutdown:", error);
        process.exit(1);
    }
}

process.on('SIGINT', handleServerShutdown);
process.on('SIGTERM', handleServerShutdown);