const { v4: uuidv4 } = require('uuid');
const meetings = {};

const createMeeting = (req, res) => {
    const meetingCode = uuidv4().slice(0, 6); 
    const hostId = req.user.uid;

    meetings[meetingCode] = { hostId, participants: [] };
    res.status(201).json({ meetingCode });
};

const joinMeeting = (req, res) => {
    const { meetingCode } = req.body;

    if (!meetings[meetingCode]) {
        return res.status(404).json({ message: 'Meeting not found' });
    }

    res.status(200).json({ message: 'Joined successfully' });
};

module.exports = { createMeeting, joinMeeting };
