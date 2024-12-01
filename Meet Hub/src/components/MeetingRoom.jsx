import React, { useState, useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import io from 'socket.io-client';
import Chat from './Chat';

function MeetingRoom({ user }) {
  const [socket, setSocket] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [roomId, setRoomId] = useState('');
  const { roomId: paramRoomId } = useParams();
  const history = useHistory();
  const localVideoRef = useRef();
  const peerConnections = useRef({});

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch((error) => console.error('Error accessing media devices:', error));

    return () => {
      newSocket.close();
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (socket && localStream) {
      socket.on('user-connected', handleUserConnected);
      socket.on('user-disconnected', handleUserDisconnected);
      socket.on('offer', handleOffer);
      socket.on('answer', handleAnswer);
      socket.on('ice-candidate', handleIceCandidate);

      if (paramRoomId) {
        joinRoom(paramRoomId);
      }
    }

    return () => {
      if (socket) {
        socket.off('user-connected');
        socket.off('user-disconnected');
        socket.off('offer');
        socket.off('answer');
        socket.off('ice-candidate');
      }
    };
  }, [socket, localStream, paramRoomId]);

  const createPeerConnection = (userId) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { to: userId, candidate: event.candidate });
      }
    };

    peerConnection.ontrack = (event) => {
      setRemoteStreams(prev => ({
        ...prev,
        [userId]: event.streams[0]
      }));
    };

    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnections.current[userId] = peerConnection;
    return peerConnection;
  };

  const handleUserConnected = async (userId) => {
    const peerConnection = createPeerConnection(userId);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit('offer', { to: userId, offer });
  };

  const handleUserDisconnected = (userId) => {
    if (peerConnections.current[userId]) {
      peerConnections.current[userId].close();
      delete peerConnections.current[userId];
    }
    setRemoteStreams(prev => {
      const newStreams = { ...prev };
      delete newStreams[userId];
      return newStreams;
    });
  };

  const handleOffer = async (data) => {
    const peerConnection = createPeerConnection(data.from);
    await peerConnection.setRemoteDescription(data.offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit('answer', { to: data.from, answer });
  };

  const handleAnswer = async (data) => {
    await peerConnections.current[data.from].setRemoteDescription(data.answer);
  };

  const handleIceCandidate = async (data) => {
    await peerConnections.current[data.from].addIceCandidate(new RTCIceCandidate(data.candidate));
  };

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(7);
    joinRoom(newRoomId);
  };

  const joinRoom = (roomId) => {
    setRoomId(roomId);
    socket.emit('join-room', { roomId, userId: user.uid });
    history.push(`/meeting/${roomId}`);
  };

  return (
    <div className="meeting-room">
      <h2>Meeting Room: {roomId}</h2>
      <div className="video-container">
        <video ref={localVideoRef} autoPlay muted playsInline />
        {Object.entries(remoteStreams).map(([userId, stream]) => (
          <video key={userId} autoPlay playsInline ref={el => {
            if (el) el.srcObject = stream;
          }} />
        ))}
      </div>
      <div className="controls">
        <button onClick={createRoom}>Create Room</button>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter room code"
        />
        <button onClick={() => joinRoom(roomId)}>Join Room</button>
      </div>
      <Chat socket={socket} user={user} roomId={roomId} />
    </div>
  );
}

export default MeetingRoom;

