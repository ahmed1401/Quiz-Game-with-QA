const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const User = require('../models/User');

router.get('/test', (req, res) => {
    res.json({ message: 'User routes working' });
});
router.get('/', userController.getUsers);
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.patch('/score/:userId', async (req, res) => {
    console.log('Received score update request:', {
        params: req.params,
        body: req.body
    });
    try {
        const { categoryIndex, score } = req.body;
        const userId = req.params.userId;
        
        if (categoryIndex < 0 || categoryIndex > 3) {
            return res.status(400).json({ message: 'Invalid category index' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (score > user.scores[categoryIndex]) {
            user.scores[categoryIndex] = score;
            await user.save();
        }

        res.json({ scores: user.scores });
    } catch (error) {
        console.error('Error updating score:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find({}, 'username scores');     
        res.json(users);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;
