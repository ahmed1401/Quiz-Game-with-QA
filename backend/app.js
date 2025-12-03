const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const questionRoutes = require('./routes/questionRoutes');

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:4300').split(',').map((origin) => origin.trim()).filter(Boolean);

// middleware
app.disable('x-powered-by');
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, origin);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; frame-ancestors 'none'; script-src 'self'; connect-src 'self'; img-src 'self' data: https:; style-src 'self';");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

// routes
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const connectDB = (uri) => {
    const connectionUri = uri || process.env.MONGO_URI;
    if (!connectionUri) {
        throw new Error('MongoDB connection string is not defined');
    }
    return mongoose.connect(connectionUri);
};

const startServer = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

if (require.main === module) {
    startServer();
}

module.exports = { app, connectDB };

