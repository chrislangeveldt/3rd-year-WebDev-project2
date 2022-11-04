import { useState, useEffect } from "react";
import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Swal from "sweetalert2";

const AddPost = () => {
  const [data, setData] = useState([]);
  const [group_name, setGroupName] = useState("");
  const [category, setCat] = useState("");
  const [text, setText] = useState("");
  const [latitude, setLat] = useState(null);
  const [longitude, setLon] = useState(null);
  const [video_url, setVid] = useState("");
  const [isDuplicate, setDuplicate] = useState(false);

  function setLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  function setHashtags(hashtag) {
    setDuplicate(false);
    const ht = hashtag.split("#");
    const hash = [];
    for (let i = 0; i < ht.length; i++) {
      if (i !== ht.length - 1) {
        hash[i] = "#" + ht[i + 1];
      }
    }
    setCat(hash);
    for (let i = 0; i < ht.length; i++) {
      for (let j = i + 1; j < ht.length; j++) {
        if (hash[i] === hash[j]) setDuplicate(true);
      }
    }
  }

  async function getFilteredMyGroups(group) {
    if (group === "") {
      group = "%";
    }
    const response = await fetch(`http://127.0.0.1:5000/groups/my/group=${group}`, {//type=location || date
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
    getFilteredMyGroups("%");
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!text) {
      Swal.fire("Please include a post description", "Try again!", "warning");
      return;
    }
    if (latitude != null) {
      if (
        !/^[+-]?(([1-8]?[0-9])(\.[0-9]{1,12})?|90(\.0{1,9})?)$/.test(
          latitude.toString()
        )
      ) {
        Swal.fire(
          "Please include an appropriate latitude",
          "Try again!",
          "warning"
        );
        return;
      }
    }
    if (longitude != null) {
      if (
        !/^[+-]?(([1-8]?[0-9])(\.[0-9]{1,12})?|90(\.0{1,9})?)$/.test(
          longitude.toString()
        )
      ) {
        Swal.fire(
          "Please include an appropriate longitude",
          "Try again!",
          "warning"
        );
        return;
      }
    }
    if (/\s/g.test(category)) {
      Swal.fire(
        "Please do not include spaces with hashtags",
        "Try again!",
        "warning"
      );
      return;
    }
    if (
      !/(.*[#])*([a-zA-Z0-9_])(.*[#])*([a-zA-Z0-9_])(.*[#])*([a-zA-Z0-9_])/.test(
        category
      )
    ) {
      Swal.fire("Please include at least 3 hashtags", "Try again!", "warning");
      return;
    }
    if (isDuplicate) {
      Swal.fire("Please include UNIQUE hashtags", "Try again!", "warning");
      return;
    }
    if (group_name === "" && document.getElementById("group_name").value==="") {
      Swal.fire("Please select a group", "Try again!", "warning");
      return;
    }

    const requestOpt = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        group_name: document.getElementById("group_name").value,
        hashtags: category,
        text: text,
        video_url: video_url,
        longitude: longitude,
        latitude: latitude,
      }),
    };
    fetch("http://127.0.0.1:5000/post", requestOpt)
      .then((response) => response.json())
      .catch((error) => console.log(error));

    window.location.reload();

    setGroupName("");
    setCat("");
    setText("");
    setLon("");
    setLat("");
    setVid("");
  };

  return (
    <div className="header">
      {/* <label>{sessionStorage.getItem('token')}</label> */}
      <form className="add-form" onSubmit={onSubmit}>
        <div className="form-control">
          <h3>Post</h3>
          <textarea
            className="post"
            type="text"
            placeholder="Post message..."
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="post-elements">
          <input
            className="post"
            type="text"
            placeholder="#Atleast#3#Hashtags"
            onChange={(e) => setHashtags(e.target.value)}
          />
          <label className="vid">
            <input
            type="file"
            accept="video/mp4,video/x-m4v,video/*"
            className="video-file"
            onChange={(e) => setVid(e.target.value)}
            />
            <label className="upvid">Upload video</label>
          </label>
         
          <select
            className="tab"
            required
            id="group_name"
            // value={group_name}
            // onChange={(e) => setGroupName(e.target.value)}
          >
            <option value={category} hidden>
              Select group
            </option>
            {data.map((d) => (
              <option value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>
        
        
        <div className="post-elements2">
          <label  className="location-man">Share Location(Manually):</label>
          <input
            className="latitude"
            type="text"
            placeholder="latitude..."
            onChange={(e) => setLat(e.target.value)}
          />
          <input
            className="longitude"
            type="text"
            placeholder="longitude..."
            onChange={(e) => setLon(e.target.value)}
          />
        </div>


        <div className="post-elements2">
          <div className="radio-btn">
            <label className="text">Share Location(automatic):</label>
            <input
              type="radio"
              name="location"
              className="auto-radio"
              onChange={() => {
                setLocation();
              }}
            />
          </div>
          <div className="post-btn-div">
            <button
              className="post-btn"
              onClick={() => {
                onSubmit();
              }}
              >
              Add Post
          </button>
          </div>
        </div>




        
       
        
      </form>
    </div>
  );
};

export default AddPost;
