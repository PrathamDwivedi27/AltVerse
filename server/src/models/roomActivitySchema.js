import mongoose from "mongoose";

const roomActivitySchema = new mongoose.Schema(
  {
    universeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Universe",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["join", "left"],
      required: true,
    },
  },
  { timestamps: true }
);

const RoomActivity = mongoose.model("RoomActivity", roomActivitySchema);

export default RoomActivity;
