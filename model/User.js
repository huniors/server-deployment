import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        require: true,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        maxlength: 30,
    },
    password: {
        type: String,
        required: true,
        maxlength: 60,
    },
    likedList: {
       type: [String],
       required: false,
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
    },
});

const User = model('User', userSchema);

export default User;