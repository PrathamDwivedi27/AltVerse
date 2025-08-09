import UniverseService from "../services/UniverseService.js";
import jwt from "jsonwebtoken";
import {INVITE_SECRET} from "../config/server-config.js";
import { INVITE_EXPIRES_IN } from "../config/server-config.js";
import { CLIENT_URL } from "../config/server-config.js";
import User from "../models/userSchema.js";
import Universe from "../models/universeSchema.js";
import { onlineUsers } from '../sockets/socketState.js';
import { io } from "../index.js";


const universeService = new UniverseService();

const createUniverse = async (req, res) => {
  try {
    const creator = req.user._id;
    const { title, rules } = req.body;

    if (!title || !rules) {
      return res.status(400).json({ message: "Title and rules are required" });
    }

    const universe = await universeService.createUniverse({ title, rules, creator });
    return res.status(201).json({ 
        message: "Universe created", 
        data: universe ,
    });
  } catch (error) {
    return res.status(500).json({ 
        message: error.message,
        error: error.message
    });
  }
};

const getMyUniverses = async (req, res) => {
  try {
    const userId = req.user._id;
    const universes = await universeService.getUniverses(userId);
    return res.status(200).json({ 
        message: "My universes fetched successfully",
        data:universes 
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteUniverse = async (req, res) => {
  try {
    const userId = req.user._id;
    const universeId = req.params.id;

    const deleted = await universeService.deleteUniverse(universeId, userId);
    if (!deleted) {
      return res.status(403).json({ message: "Only the creator can delete this universe" });
    }

    return res.status(200).json({ message: "Universe deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUniverseTitle = async (req, res) => {
  try {
    const userId = req.user._id;
    const universeId = req.params.id;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "title field is required" });
    }

    const updated = await universeService.updateUniverseTitle(universeId, userId, title);
    if (!updated) {
      return res.status(403).json({ message: "Only the creator can update the title" });
    }

    return res.status(200).json({ message: "Title updated successfully", universe: updated });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const generateInviteLink = async (req, res)=>{
  try {
    const {id: universeId} = req.params;
    const userId = req.user._id;

    const universe = await universeService.getUniverseById(universeId);
    if (!universe) {
      return res.status(404).json({ message: "Universe not found" });
    }

    if ((universe.creator._id || universe.creator).toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the creator can generate an invite link" });
    }

    const token =jwt.sign(
      {universeId},
      INVITE_SECRET,
      { expiresIn: INVITE_EXPIRES_IN }
    );

    const inviteLink = `${CLIENT_URL}/invite/${token}`;
    return res.status(200).json({
      message: "Invite link generated successfully",
      link: inviteLink
    });
  } catch (error) {
    return res.status(500).json({ 
      message: error.message,
      error: error.message
     });
    
  }
}

const redeemInviteLink = async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.user._id;

    if (!token) {
      return res.status(400).json({ message: "Invite token is required" });
    }

    const decoded = jwt.verify(token, INVITE_SECRET);
    const {universeId} = decoded;

    const universe= await universeService.getUniverseById(universeId);
    if (!universe) {
      return res.status(404).json({ message: "Universe not found" });
    }

    const alreadyIn = universe.participants.some(p => p.toString() === userId.toString());
    if (alreadyIn) {
      return res.status(400).json({ message: "You are already a participant in this universe" });
    }

    // Add to universe participants
    await Universe.findByIdAndUpdate(universeId, {
      $addToSet: { participants: userId }
    });


    await User.findByIdAndUpdate(userId, {
      $addToSet: { joinedUniverses: universeId }
    });

    return res.status(200).json({
      message: "Invite redeemed successfully",
    });
  } catch (error) {
    return res.status(500).json({ 
      message: error.message,
      error: error.message
    });
    
  }
};

const kickParticipant = async (req, res) => {
  try {
    const {id:universeId}= req.params;
    const {participantId} = req.body;
    const userId = req.user._id;

    if (!universeId || !participantId) {
      return res.status(400).json({ message: "Universe ID and participant ID are required" });
    }

    const kicked = await universeService.kickParticipant(universeId, userId, participantId);
    if (!kicked) {
      return res.status(403).json({ message: "Only the creator can kick participants" });
    }

    const kickedUserSocket = onlineUsers.get(participantId.toString());
    if (kickedUserSocket) {
      io.to(kickedUserSocket.socketId).emit('you-were-kicked', { universeId });
    }

    return res.status(200).json({
      message: "Participant kicked successfully",
      universe: kicked 
      });
  } catch (error) {
    return res.status(500).json({ 
      message: error.message ,
      error: error.message
    });
  }
};

export {
    createUniverse,
    getMyUniverses,
    deleteUniverse,
    updateUniverseTitle,
    generateInviteLink,
    redeemInviteLink,
    kickParticipant
}
