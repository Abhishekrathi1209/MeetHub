import React, { useState } from 'react';
import { signInWithGoogle, logout } from '../services/firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const { user, setUser } = useAuth();
    const [meetingCode, setMeetingCode] = useState('');
    const navigate = useNavigate();

    const handleSignIn = async () => {
        const userInfo = await signInWithGoogle();
        setUser(userInfo);
    };

    const handleLogout = async () => {
        await logout();
        setUser(null);
    };

    const handleCreateMeeting = async () => {
        const token = await user.getIdToken();
        const response = await axios.post(
            'http://localhost:5000/api/meetings/create',
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        navigate(`/meeting/${response.data.meetingCode}`);
    };

    const handleJoinMeeting = () => {
        navigate(`/meeting/${meetingCode}`);
    };

    return (
        <div className="home">
            {!user ? (
                <button onClick={handleSignIn}>Sign In with Google</button>
            ) : (
                <div>
                    <h3>Welcome, {user.displayName}</h3>
                    <button onClick={handleLogout}>Logout</button>
                    <button onClick={handleCreateMeeting}>Create Meeting</button>
                    <div>
                        <input
                            type="text"
                            placeholder="Enter Meeting Code"
                            value={meetingCode}
                            onChange={(e) => setMeetingCode(e.target.value)}
                        />
                        <button onClick={handleJoinMeeting}>Join Meeting</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
