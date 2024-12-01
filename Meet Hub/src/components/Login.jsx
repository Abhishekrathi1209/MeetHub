import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

function Login() {
  const handleGoogleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  };

  return (
    <div className="login">
      <h1>Welcome to Video Conferencing App</h1>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </div>
  );
}

export default Login;

