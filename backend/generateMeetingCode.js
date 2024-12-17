const { v4: uuidv4 } = require('uuid');

const generateMeetingCode = () => uuidv4().slice(0, 6);

module.exports = generateMeetingCode;