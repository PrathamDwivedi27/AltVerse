import mongoose from "mongoose";

const universeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  rules: {
    government: {
      type: String,
      enum: ["democracy", "dictatorship", "ai-run"],
      required: true,
    },
    techLevel: {
      type: String,
      enum: ["primitive", "modern", "futuristic"],
      required: true,
    },
    economy: {
      type: String,
      enum: ["capitalist", "socialist", "barter"],
      required: true,
    },
    language: {
      type: String,
      enum: ["unified", "diverse"],
      required: true,
    },
    morality: {
      type: String,
      enum: ["strict", "free", "tribal"],
      required: true,
    },
  },

  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  timeline: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  lore: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LoreEntry' }],

  mapData: {
    regions: [{
      name: String,
      type: String,
      x: Number,
      y: Number
    }],
    events: [{
      location: String,
      type: String,
      label: String
    }],
    backgroundUrl: String
  }

}, { timestamps: true });

universeSchema.path('participants').validate(function(value) {
  return value.length <= 10;
}, 'A universe can have at most 10 participants.');

const Universe = mongoose.model('Universe', universeSchema);

export default Universe;
