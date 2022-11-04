import "./CSS/Home.css";
import logo from "../SPOT.svg";
import moment from "moment";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import AddPost from "./AddPost";
import ShowMap from "./ShowMap";
import BigMap from "./BigMap";
import Posts from "./Posts";


function Home() {
  const handleLogout = () => {
    backendLogout();
    localStorage.clear();
    sessionStorage.clear();
    window.location.pathname = "/login";
  };
  const handleViewProfile = () => {
    window.location.pathname = "/ViewProfile";
  };

  const handleViewGroups = () => {
    window.location.pathname = "/Groups";
  };

  const handleFriends = () => {
    window.location.pathname = "/Friends";
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
  return (
    <>
<div className="container">
      <div class="center">
        {/* <div class="header"> */}
        <AddPost></AddPost>
        <Posts></Posts>
        {/* </div> */}
        
      </div>

      <div className="left-side">
          <div className="logo">
            <img
              src={logo}
              className="logoNav"
              alt="Test"
              height="75"
              width="75"
            />
          </div>
            <button onClick={handleViewProfile}> Profile</button> 
            <button onClick={handleFriends}> Friends</button>
            <button onClick={handleViewGroups}> Groups</button>
            <BigMap></BigMap>
            <button className="styleBtn" onClick={handleLogout}>
              Logout{" "}
            </button>

      </div>
      
        
      </div>
    </>
  );
}

export default Home;
