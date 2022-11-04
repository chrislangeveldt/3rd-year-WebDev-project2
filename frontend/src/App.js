import React, { useEffect, useState } from "react";
import "./App.css";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Components/Home";
import ProtectedRoute from "./Components/ProtectedRoute";
import "./Components/CSS/LoginCSS.css";
import ViewComments from "./Components/ViewComments";
import UpdateProfile from "./Components/UpdateProfile";
import MyGroups from "./Components/Groups";
import Friends from "./Components/Friends";
import ShowGroup from "./Components/ShowGroup";
import MakeGroup from "./Components/MakeGroup";

function App() {
  const [data, setData] = useState([]);
  // const [timeoutTime, setData] = useState([]);
  const timeoutMinutes = 25; //only logout on use not if closed

  const handleLogout = () => {
    backendLogout();
    localStorage.clear();
    sessionStorage.clear();
    window.location.pathname = "/login";
  };
  async function backendLogout() {
    const requestOpt = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', "access-token": localStorage.getItem("token") },
    }
    return await fetch('http://127.0.0.1:5000/logout', requestOpt)
      .then(response => response.json())
      .catch(error => console.log(error));
  }

  useEffect(() => {
    if (data === "True") {
      const timer = setTimeout(() => {
        alert("Your session has expired. You will be logged out.");
        handleLogout();
        localStorage.setItem("timeoutTime", "false");
      }, 1000 * 60 * timeoutMinutes);
    }
    // getTimeout();
  }, []);

  return (
    <Router>
      <div>
        <Router>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/logout" component={handleLogout} />
          <ProtectedRoute exact path="/ViewProfile" component={UpdateProfile} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute path="/comments" component={ViewComments} />
          <ProtectedRoute path="/Groups" component={MyGroups} />
          <ProtectedRoute path="/CreateGroup" component={MakeGroup} />
          <ProtectedRoute path="/Friends" component={Friends} />
          <ProtectedRoute path="/ShowGroup" component={ShowGroup} />
        </Router>
        {/* )} */}
      </div>
    </Router>
  );
}

export default App;
