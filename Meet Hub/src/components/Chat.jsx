import React, { useState, useEffect } from 'react';

function Chat({ socket, user, roomId }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    if (socket) {
      socket.on('chat-message', (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
      });
    }

    return () => {
      if (socket) {
        socket.off('chat-message');
      }
    };
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && socket) {
      const messageData = {
        content: inputMessage,
        sender: user.displayName,
        timestamp: new Date().toISOString(),
      };
      socket.emit('send-message', { roomId, message: messageData });
      setMessages(prevMessages => [...prevMessages, messageData]);
      setInputMessage('');
    }
  };

  return (
    <div className="chat">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <strong>{message.sender}: </strong>
            <span>{message.content}</span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;

