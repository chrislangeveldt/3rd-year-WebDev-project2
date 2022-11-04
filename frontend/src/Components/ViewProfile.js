import { useState } from "react";
import React from "react";

export default function ViewProfile() {
  const [data, setData] = useState([]);
  const [onceOff, setOnceOff] = useState(true);

  const handleViewProfile = () => {
    window.location.pathname = "/ViewProfile";
  };

  const handleViewGroups = () => {
    window.location.pathname = "/Groups";
  };

  const handleFriends = () => {
    window.location.pathname = "/Friends";
  };

  const handleDelete = () => { 
    const requestOpt = {
      method: "DELETE",
      headers: { "Content-Type": "application/json","access-token": localStorage.getItem("token") },
    };
    async function fetchFunc() {
      return await fetch(`http://127.0.0.1:5000/profile/delete`, requestOpt)
        .then((response) => response.json())
        .catch((error) => console.log(error));
    }
    (async () => {
      await fetchFunc();
    })();
    alert("Deleted Account");
    localStorage.clear();
    sessionStorage.clear();
    window.location.pathname = "/login";
  };

  const handleEdit = (e) => {
    e.preventDefault();
    const isDev = localStorage.getItem("isDev");
    if (isDev === "false") {
      window.location.pathname = "/EditComProfile";
    } else {
      window.location.pathname = "/EditDevProfile";
    }
  };

  const handleHome = (e) => {
    e.preventDefault();
    window.location.pathname = "/";
  };

  if (onceOff) {
    fetch(`http://127.0.0.1:5000/getMyProfile`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((response) => setData(response))
      .catch((error) => console.log(error));
    setOnceOff(false);
  }
  return (
    <><nav id="navbar" class="">
      <div className="nav-wrapper">
        <div className="logo">
          <img
            src={logo}
            className="logoNav"
            alt="Test"
            height="75"
            width="75" />
        </div>

        <ul id="menu">
          <li>
            <a onClick={handleFriends}> Friends</a>
          </li>
          <li>
            <a onClick={handleViewGroups}> Groups</a>
          </li>
          <li>
            <a onClick={handleViewProfile}> Profile</a>
          </li>
          <li>
            <button className="styleBtn" onClick={handleLogout}>
              Logout{" "}
            </button>
          </li>
        </ul>
      </div>
    </nav><div className="card">
        <form onSubmit={handleEdit}>
          <h1>Profile Preview</h1>
          <label className="custom-file-upload fas">
            <div className="img-wrap">
              <img
                for="photo-upload"
                src={"https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true"}
                alt="Upload" />
            </div>
          </label>
          {data.map((d) => (
            <>
              <div className="name">{d.name}</div>
              <div className="email">
              </div>
              <div className="open">
                {d.open_to_contracts == true
                  ? "Private Account"
                  : "Public Account"}
              </div>
              <div className="Money made:">
              </div>
            </>
          ))}
          <button className="styleBtn edit" type="submit">
            Edit Details{" "}
          </button>
          <button className="deleteBtn" onClick={handleDelete}>
            Delete Account{" "}
          </button>
          <button className="btn home" onClick={handleHome}>
            Back Home
          </button>
        </form>
      </div></>
  );
}
