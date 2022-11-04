import { MapContainer, TileLayer, useMap } from "react-leaflet";
import React from "react";
import "leaflet/dist/leaflet.css";
import "./CSS/Home.css";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import icon from "leaflet/dist/images/marker-icon.png";
import L from "leaflet";
import { useState } from "react";

const ShowMap = ({ lat, lng }) => {
  const [sMap, setMap] = useState(false);
  function GetIcon(iS) {
    return L.icon({
      iconUrl: require("../Static/Icons/mapmarker.png"),
      iconSize: [iS]
    })

  }

  const position = [lat, lng];
  return (
    <>
      <div className="show-map-container">
        {sMap ? (
          <div className="show-map">
            <MapContainer
              center={position}
              zoom={13}
              style={{ width: "300px", height: "300px", position: "center" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position} icon={GetIcon(30)}>
                <Popup>
                  <label>Latitude: {lat}</label>
                  <br></br>
                  <label>Longitude: {lng}</label>
                </Popup>
              </Marker>
            </MapContainer>
            <button
              className="close-show-map"
              onClick={() => {
                setMap(false);
              }}
            >
              Close Map
            </button>
          </div>
        ) : (
          <button
            // className="show-map"
            onClick={() => {
              setMap(true);
            }}
          >
            Show Map
          </button>
        )}
      </div>
    </>
  );
};

export default ShowMap;
