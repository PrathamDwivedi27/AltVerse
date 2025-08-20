import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    universeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Universe",
      required: true,
    },
    prompt: { 
        type: String, 
        required: true 
    },
    submittedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },

    aiOutcome: {
      content: { 
        type: String, 
        required: true 
      },
      resultType: {
        type: String,
        enum: ["positive", "neutral", "chaotic"],
        default: "neutral",
      },
      mapEffect: {
        type: {
          type: String,
          enum: ['marker', 'area_highlight', 'pulse_effect'],
        },
        coordinates: {
          type: [Number], // [x, y]
        },
        description: String,
        icon: String, // e.g., 'explosion', 'new-city'
      }
    },
  },
  { timestamps: true }
);

eventSchema.index({ universeId: 1 });
const Event = mongoose.model("Event", eventSchema);

export default Event;
