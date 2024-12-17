import React, { useState } from 'react';

const ChatBox = ({ socket, meetingCode }) => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);

    const sendMessage = () => {
        socket.emit('send-message', { meetingCode, message, userId: 'user1' });
        setChat((prev) => [...prev, { userId: 'You', message }]);
        setMessage('');
    };

    socket.on('receive-message', (data) => {
        setChat((prev) => [...prev, data]);
    });

    return (
        <div className="chat-box">
            <div className="chat-messages">
                {chat.map((c, index) => (
                    <p key={index}>
                        <strong>{c.userId}:</strong> {c.message}
                    </p>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatBox;
