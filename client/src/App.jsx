import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Meeting from './components/Meeting';
import { AuthProvider } from './context/AuthContext';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/meeting/:meetingCode" element={<Meeting />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
