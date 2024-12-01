import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import Login from './components/Login';
import MeetingRoom from './components/MeetingRoom';


const firebaseConfig = {
  apiKey: "AIzaSyCTu85spU60YICwlpnqMn-KhcSZMs9hol4",
  authDomain: "meet-auth-54bf9.firebaseapp.com",
  projectId: "meet-auth-54bf9",
  storageBucket: "meet-auth-54bf9.firebasestorage.app",
  messagingSenderId: "333207858692",
  appId: "1:333207858692:web:3932f4bb6b046166378f51"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            {user ? <Redirect to="/meeting" /> : <Login />}
          </Route>
          <Route path="/meeting/:roomId?">
            {user ? <MeetingRoom user={user} /> : <Redirect to="/" />}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

