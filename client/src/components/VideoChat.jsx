import React, { useRef, useEffect } from 'react';

const VideoChat = ({ socket }) => {
    const localVideoRef = useRef(null);

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                localVideoRef.current.srcObject = stream;
            })
            .catch((error) => console.error('Error accessing media devices:', error));
    }, []);

    return (
        <div className="video-chat">
            <video ref={localVideoRef} autoPlay muted />
            {/* Add other participant videos */}
        </div>
    );
};

export default VideoChat;
