import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import VideoChat from './VideoChat';
import ChatBox from './ChatBox';

const socket = io('http://localhost:5000');

const Meeting = () => {
    const { meetingCode } = useParams();
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        socket.emit('join-meeting', { meetingCode, userId: 'user1' });

        socket.on('user-joined', (data) => {
            setParticipants((prev) => [...prev, data.userId]);
        });

        return () => {
            socket.disconnect();
        };
    }, [meetingCode]);

    return (
        <div className="meeting">
            <VideoChat socket={socket} />
            <ChatBox socket={socket} meetingCode={meetingCode} />
        </div>
    );
};

export default Meeting;
