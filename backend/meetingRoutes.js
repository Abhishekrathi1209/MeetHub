const express = require('express');
const { createMeeting, joinMeeting } = require('./meetingController');
const { verifyToken } = require('./firebaseConfig');

const router = express.Router();

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    try {
        req.user = await verifyToken(token);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

router.post('/create', authenticate, createMeeting);
router.post('/join', authenticate, joinMeeting);

module.exports = router;
