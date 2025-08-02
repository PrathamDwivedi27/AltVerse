import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
        required: true
    },

    createdUniverses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Universe'
    }],

    joinedUniverses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Universe'
    }]
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;