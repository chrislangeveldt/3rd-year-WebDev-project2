import React from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./CSS/Home.css";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import icon from "leaflet/dist/images/marker-icon.png";
import L from "leaflet";
import { useState, useEffect } from "react";
import moment from "moment";

const BigMap = () => {
  const [data, setData] = useState([]);
  const [lat, setLat] = useState(null);
  const [lng, setLon] = useState(null);
  const [sMap, setMap] = useState(false);
  const position = [lat, lng];

  function setLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
        setMap(true);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  const handleComments = (id) => {
    window.location.pathname = `/comments/${id}`;
  };

  function GetIcon(iS) {
    return L.icon({
      iconUrl: require("../Static/Icons/mapmarker.png"),
      iconSize: [iS],
    });
  }

  async function getPosts() {
    const response = await fetch(`http://127.0.0.1:5000/feed/group=${"%"}&user=${"%"}&tag=${"%"}&orderby=${"date"}&order=${"dsc"}&lat=${"%"}&lng=${"%"}&radius=${"%"}`, {
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
    getPosts();
  }, []);

  return (
    <div className="show-map-container">
      {/* <label> See Posts Around You</label> */}

      <div className="show-map-container">
        {sMap ? (
          <div className="show-map-container">
            <MapContainer
              center={position}
              zoom={13}
              style={{width: "500px", height: "500px", position: "center" , margin: "5px 0px 0px 0px"}}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {data.map((d) => (
                <div>
                  {d.latitude == null ? (
                    <label></label>
                  ) : (
                    <Marker
                      position={[d.latitude, d.longitude]}
                      icon={GetIcon(40)}
                    >
                      <Popup>
                        <div>
                          <h3 className="post">{"@" + d["user.username"]}</h3>
                          <label className="post-text">Group: {d["group.name"]}</label><br/>
                          <label className="post-text">{d.text}</label><br/>
                          <label>
                            {moment(d.date).format("hh:mm A") +
                              " - " +
                              moment(d.date).format("DD/MM")}
                          </label>
                          <br></br>
                          <button
                            className="show-comment"
                            onClick={() => handleComments(d.id)}
                          >
                            Go to Post
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </div>
              ))}
            </MapContainer>
            <button
              // className="post"
              onClick={() => {
                setMap(false);
              }}
            >
              Close Map
            </button>
          </div>
        ) : (
          <button
            // className="post"
            onClick={() => {
              {
                lat == null ? setLocation() : setMap(true);
              }
            }}
          >
            Show Map
          </button>
        )}
      </div>
    </div>
  );
};

export default BigMap;
