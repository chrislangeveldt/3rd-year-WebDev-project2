import React, { useState, useEffect } from "react";
import "./CSS/LoginCSS.css";
import logo from "../SPOT.svg";
import MakeGroup from "./MakeGroup";

function MyGroups() {
  const [data, setData] = useState([]);
  const [dataAllGroups, setDataAllGroups] = useState([]);

  const handleFriends = () => {
    window.location.pathname = "/Friends";
  };

  const handleViewProfile = () => {
    window.location.pathname = "/ViewProfile";
  };

  const handleShowGroup = (id) => {
    window.location.pathname = `/ShowGroup/${id}`;
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.pathname = "/login";
  };

  const handleHome = (e) => {
    e.preventDefault();
    window.location.pathname = "/";
  };

  async function getFilteredMyGroups(group) {
    if (group === "") {
      group = "%";
    }
    const response = await fetch(
      `http://127.0.0.1:5000/groups/my/group=${group}`,
      {
        //type=location || date
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("token"),
        },
      }
    );
    setData(await response.json());
    return;
  }

  const handleSearchMyGroups = () => {
    let sGroup = document.getElementById("searchMyGroup").value;
    if (sGroup === "") {
      sGroup = "%";
    }
    getFilteredMyGroups(sGroup);
  };

  async function getFilteredAllGroups(group) {
    if (group === "") {
      group = "%";
    }
    const response = await fetch(
      `http://127.0.0.1:5000/groups/not-my/group=${group}`,
      {
        //type=location || date
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("token"),
        },
      }
    );
    setDataAllGroups(await response.json());
    return;
  }

  const handleSearchAllGroups = () => {
    let sGroup = document.getElementById("searchAllGroup").value;
    if (sGroup === "") {
      sGroup = "%";
    }
    getFilteredAllGroups(sGroup);
  };

  async function joinGroup(name) {
    const requestOpt = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        name: name,
      }),
    };
    fetch("http://127.0.0.1:5000/group/join", requestOpt)
      .then((response) => response.json())
      .catch((error) => console.log(error));
    setTimeout(function () {
      window.location.reload();
    }, 20);
    return;
  }

  const handleChange = () => {
    let search = document.querySelector("input").value;
  };

  useEffect(() => {
    getFilteredMyGroups("%");
    getFilteredAllGroups("%");
  }, []);

  return (
    <>
      <div className="container">
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
                      <button className="styleBtn" onClick={handleHome}>
                        Back{" "}
                      </button>
          </div>
          <div className="right-side-groups ">
            <MakeGroup></MakeGroup>

            <h1 className="posts heading">My Groups</h1>
            <div className="groups">
              <input
                type="search"
                id="searchMyGroup"
                placeholder="Search Group..."
                onInput={() => handleSearchMyGroups()}
              />
              {data.length === 0 ? (
                <div className="feed">
                  <label>You are not currently in any groups</label>
                </div>
              ) : (
                <div className="feed">
                  {data.map((d) => (
                    <div className="groups">
                      <label className="namegroup">{d.name}</label>
                      <button
                        className="show-comment"
                        onClick={() => handleShowGroup(d.id)}
                      >
                        View Group
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>



            <h1 className="posts heading">All Groups</h1>
            <div className="groups">
              <input
                type="search"
                id="searchAllGroup"
                placeholder="Search Group..."
                onInput={() => handleSearchAllGroups()}
              />
              {dataAllGroups.length === 0 ? (
                <div className="feed">
                <label>There are no groups to join</label>
                </div>
              ) : (
                <div className="group-box">
                  {dataAllGroups.map((d) => (
                    <div className="groups">
                      <label className="namegroup">{d.name}</label>
                      {/* <label className="post-text">{d.id}</label> */}
                      <button onClick={() => joinGroup(d.name)}> Join Group </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

      </div>


    </>
  );
}

export default MyGroups;
