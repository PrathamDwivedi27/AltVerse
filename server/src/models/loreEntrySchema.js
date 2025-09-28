import mongoose from 'mongoose';

const loreEntrySchema = new mongoose.Schema({
    universeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Universe',
        required: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
        type: String,
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    }
},{timestamps: true});

const LoreEntry = mongoose.model('LoreEntry', loreEntrySchema);
export default LoreEntry;