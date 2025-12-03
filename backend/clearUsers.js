require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    scores: {
        type: [Number],
        default: [0, 0, 0, 0]
    }
}, { 
    timestamps: false,
    versionKey: false
});

const User = mongoose.model('User', UserSchema);

async function clearUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const result = await User.deleteMany({});
        console.log(`Deleted ${result.deletedCount} users from the database`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    }
}

//run the script
clearUsers();