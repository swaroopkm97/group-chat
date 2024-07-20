const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

const router = express.Router();
const jwtSecret = 'Your JWT Secret';

// User registration
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password });
        await user.save();
        const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret);
        res.status(201).json({ token });
    } catch (err) {
        res.status(400).send('Error registering user');
    }
});

// User login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).send('Invalid credentials');
        }
        const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret);
        res.status(200).json({ token });
    } catch (err) {
        res.status(400).send('Error logging in');
    }
});

router.get('/messages', async (req, res) => {
    const { group } = req.query;

    try {
        const messages = await Message.find({ room: group })
            .sort({ _id: -1 })
            .limit(10);
        res.status(200).json(messages);
    } catch (err) {
        res.status(400).send('Error fetching messages');
    }
});

module.exports = router;
