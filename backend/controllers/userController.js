const User = require('../models/User');

//get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//create new user
exports.createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: 'Username, email, and password are required' 
            });
        }

        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User with this email or username already exists' 
            });
        }

        const user = new User({ username, email, password });
        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json(userResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//login user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required' 
            });
        }

        const user = await User.findOne({ email });
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }
        
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({ 
            message: 'Login successful', 
            user: userResponse 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};