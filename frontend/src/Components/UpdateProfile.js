import { useState, useEffect } from "react";
import React from "react";
import Swal from "sweetalert2";
import logo from "../SPOT.svg";

export default function UpdateProfile() {
  const [data, setData] = useState([]);

  const handleViewProfile = () => {
    window.location.pathname = "/ViewProfile";
  };

  const handleViewGroups = () => {
    window.location.pathname = "/Groups";
  };

  const handleFriends = () => {
    window.location.pathname = "/Friends";
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.pathname = "/login";
  };

  const handleDelete = () => {
    const requestOpt = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
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

  const handleHome = (e) => {
    e.preventDefault();
    window.location.pathname = "/";
  };

  const UpdateProfile = (e) => {
    e.preventDefault();
    if (document.getElementById("username").value === "") {
      Swal.fire(
        "Please enter a username",
        'REQUIRED',
        'warning',
      )
      return;
    }
    if (document.getElementById("email").value === "") {
      Swal.fire(
        "Please enter a email",
        'REQUIRED',
        'warning',
      )
      return;
    }
    if (document.getElementById("password").value === "") {
      Swal.fire(
        "Please enter a password",
        'REQUIRED',
        'warning',
      )
      return;
    }
    
    const requestOpt = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        email: document.getElementById("email").value,
        avatar_url: document.getElementById("photo-upload").value,
      }),
    };
    async function fetchFunc() {
      return await fetch("http://127.0.0.1:5000/profile/update", requestOpt)
        .then((response) => response.json())
        .catch((error) => console.log(error));
    }
    (async () => {
      let info = await fetchFunc();
      if (info.success) {
        window.location.pathname = "/";
      } else {
        Swal.fire(info.msg, "Try again!", "warning");
      }
    })();
  };

  async function getProfile() {
    const response = await fetch(`http://127.0.0.1:5000/profile/my`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
    });
    setData(await response.json());
    return;
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>

      <div className="card">
        <div className="field">
          <h2>My Profile:</h2>
          <img
            htmlFor="photo-upload"
            className="loginimg"
            src={data.avatar_url}
            alt="User Avatar"
          />
          <input
            id="photo-upload"
            className="img-upload"
            type="url"
            placeholder={"Enter URL"}
            defaultValue={
              "https://cdn.mos.cms.futurecdn.net/T7KjBY3bvJN2RJi65MP57N-1024-80.jpg.webp"
            }
          />
          <label>Username:</label>
          <input
            id="username"
            type="username"
            maxLength="25"
            defaultValue={data.username}
            required
          />
          <label>Email:</label>
          <input
            id="email"
            type="email"
            maxLength="25"
            defaultValue={data.email}
            required
          />
          <label>Password:</label>
          <input
            id="password"
            type="password"
            maxLength="25"
            required
          />

          <button className="update-btn" onClick={UpdateProfile}>
            Update Profile
          </button>
          <button className="delete-btn" onClick={handleDelete}>
            Delete Account
          </button>
          <button className="home-btn" onClick={handleHome}>
            Back Home
          </button>
        </div>
      </div>
    </>
  );
}
