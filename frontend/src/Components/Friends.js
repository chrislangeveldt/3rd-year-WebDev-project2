import React from "react";
import logo from "../SPOT.svg";
import { useState, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [users, setUsers] = useState([]);
  const [data, setData] = useState([]);

  const handleViewProfile = () => {
    window.location.pathname = "/ViewProfile";
  };

  function addFriend(id) {
    const requestOpt = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        user_id: id,
      }),
    };
    fetch("http://127.0.0.1:5000/friend/add", requestOpt)
      .then((response) => response.json())
      .catch((error) => console.log(error));

    setTimeout(function () {
      window.location.reload();
    }, 20);
  }

  function removeFriend(id) {
    const requestOpt = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        user_id: id,
      }),
    };
    fetch("http://127.0.0.1:5000/friend/remove", requestOpt)
      .then((response) => response.json())
      .catch((error) => console.log(error));

    setTimeout(function () {
      window.location.reload();
    }, 20);
  }

  const handleViewGroups = () => {
    window.location.pathname = "/Groups";
  };

  const handleLogout = () => {
    localStorage.clear();
    localStorage.clear();
    window.location.pathname = "/login";
  };

  const handleHome = (e) => {
    e.preventDefault();
    window.location.pathname = "/";
  };

  async function getPostsFilteredFriends(user) {
    if (user === "") {
      user = "%";
    }
    const response = await fetch(`http://127.0.0.1:5000/friends/user=${user}`, {
      //type=location || date
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
    });
    setFriends(await response.json());
    return;
  }

  const handleSearchFriends = () => {
    let sUser = document.getElementById("searchFriendUser").value;
    if (sUser === "") {
      sUser = "%";
    }
    getPostsFilteredFriends(sUser);
  };

  async function getPostsFilteredNonFriends(user) {
    if (user === "") {
      user = "%";
    }
    const response = await fetch(
      `http://127.0.0.1:5000/non-friends/user=${user}`,
      {
        //type=location || date
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("token"),
        },
      }
    );
    setUsers(await response.json());
    return;
  }

  const handleSearchNonFriends = () => {
    let sUser = document.getElementById("searchNonFriendUser").value;
    if (sUser === "") {
      sUser = "%";
    }
    getPostsFilteredNonFriends(sUser);
  };

  useEffect(() => {
    getPostsFilteredFriends("%");
  }, []);

  useEffect(() => {
    getPostsFilteredNonFriends("%");
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
              <button className="styleBtn" onClick={handleHome}>
                Back{" "}
              </button>
              <button onClick={handleViewProfile}> Profile</button>                    
              <button onClick={handleViewGroups}> Groups</button>
              <button className="styleBtn" onClick={handleLogout}>Logout</button>
        </div>

        <div className="right-side-groups">
          <h1>Friends</h1>
          <div className="friends">
          <input
            type="search"
            id="searchFriendUser"
            className="friendsSearch"
            placeholder="Search User..."
            onInput={() => handleSearchFriends()}
          />
          <table>
            <tbody>
              {friends.length == 0 ? (
                <label className="post feed">No users to display</label>
              ) : (
                <>
                  {friends.map((f) => (
                    <tr key={f.id}>
                      <td>{f.username}</td>
                      <td>
                        <button
                          className="follow-status"
                          onClick={() => {
                            removeFriend(f.id);
                          }}
                        >
                          unfollow
                        </button>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
          </div>

          <h1>Other Users</h1>
          <div className="friends">
        <input
          type="search"
          id="searchNonFriendUser"
          className="friendsSearch"
          placeholder="Search User..."
          onInput={() => handleSearchNonFriends()}
        />
        <table>
          <tbody>
            {users.length == 0 ? (
              <label className="post feed">No users to display</label>
            ) : (
              <>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.username}</td>

                    <td>
                      <button
                        className="follow-status"
                        onClick={() => {
                          addFriend(u.id);
                        }}
                      >
                        Follow
                      </button>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Friends;
