import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    universeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Universe",
      required: true,
      index: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: ["text", "image", "sticker", "audio", "mixed"],
      default: "text"
    },
    // text / caption
    text: {
      type: String,
      default: ""
    },

    mediaUrl: {
      type: String,
      default: ""
    },
    mediaPublicId: { 
        type: String,
        default: "" 
    }, // cloudinary public id for optional deletes
    mediaType: {
      type: String,
      enum: ["none", "image", "sticker", "audio"],
      default: "none"
    },
    // for audio messages (seconds)
    duration: {
      type: Number,
      default: 0
    },

    edited: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

messageSchema.index({ universeId: 1, createdAt: -1 }); // pagination

const Message = mongoose.model("Message", messageSchema);
export default Message;
