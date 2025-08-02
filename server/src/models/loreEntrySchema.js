import mongoose from 'mongoose';

const loreEntrySchema = new mongoose.Schema({
    universeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Universe',
        required: true
    },

    content: {
        type: String,
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
},{timestamps: true});

const LoreEntry = mongoose.model('LoreEntry', loreEntrySchema);
export default LoreEntry;