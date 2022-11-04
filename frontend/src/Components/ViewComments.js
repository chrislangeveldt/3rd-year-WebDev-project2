import './CSS/Home.css';
import logo from '../SPOT.svg'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import ShowMap from "./ShowMap";
import ReactPlayer from 'react-player';

export default function ViewComments() {
    const [text, setText] = useState('')
    const [comment, setComment] = useState('')
    const [data, setData] = useState([]);
    const [dataPost, setDataPost] = useState([]);
    const [onceOff, setOnceOff] = useState(true);

    const onSubmit = (e) => {
        e.preventDefault();
        const requestOpt = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'access-token': localStorage.getItem("token") },
            body: JSON.stringify({
                'text': document.getElementById("comment").value,//group_name
                'post_id': postId,
            }),
        }
        fetch('http://127.0.0.1:5000/comment', requestOpt)
            .then(response => response.json())
            .catch(error => console.log(error));

        window.location.reload();
    }
    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.pathname = "/login";
    };
    const handleViewProfile = () => {
        window.location.pathname = "/ViewProfile";
    };
    const handleBack = () => {
        window.location.pathname = "/";
    };
    const handleViewGroups = () => {
        window.location.pathname = "/Groups";
    };

    const handleViewExplore = () => {
        window.location.pathname = "/Explore";
    };

    const handleFriends = () => {
        window.location.pathname = "/Friends";
    };

    async function getPost() {
        const response = await fetch(`http://127.0.0.1:5000/get/post=${postId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "access-token": localStorage.getItem("token") },
        });
        setDataPost(await response.json());
        return;
    }

    async function getComments() {
        const response = await fetch(`http://127.0.0.1:5000/comments/post=${postId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "access-token": localStorage.getItem("token") },
        });
        setData(await response.json());
        return;
    }
    var str = "" + window.location.pathname;
    var postId = str.substring(str.lastIndexOf("/") + 1, str.length);
    //console.log(postId);

    useEffect(() => {
        getComments();
        getPost();
    }, [])
    return (
        <>
        <div className="container">
                    <div className="left-side">
                        <button className="styleBtn" onClick={handleBack}>
                        Back{" "}
                        </button>
                        <button onClick={handleViewProfile}> Profile</button>
                        <button onClick={handleFriends}> Friends</button>
                        <button onClick={handleViewGroups}> Groups</button>
                        <button className="styleBtn" onClick={handleLogout} >Logout </button>
                    </div>
                    <div className='right-side-groups'>
                        <div className="single-post">
                            <div className='user-group-name'>
                                <label className="username">{"@" + dataPost["user.username"]}</label>
                                <label className='post-time'>{moment(dataPost.date).format('hh:mm A') + " - " + moment(data.date).format("DD/MM")}</label>

                            </div>
                            
                            <p className="comment-post-text">{dataPost.text}</p>

                            {/* {dataPost.video_url === '' ? (
                                <label></label>
                                ) : (
                                <div className="post-vid">
                                    <ReactPlayer url={'./videos/'.concat(dataPost.video_url)} controls={true} className="react-player" width="100%" height="100%"/>    
                                </div>
                                
                                )} */}
                            
                            <label className='hashtag'>{dataPost.hashtags_text}</label>
                            <label className='location'>Location: {dataPost.latitude+" "+dataPost.longitude}</label>
                            <div className="button-map-elements">
                                {dataPost.latitude == null ? (
                                <label></label>
                                ) : (
                                    // <div>
                                    <ShowMap lat={dataPost.latitude} lng={dataPost.longitude}></ShowMap>
                                    // </div>
                                )}
                            </div>
                            
                            
                        </div>
                        
                        <div className="make-comment">
                            {/* <label className="post">Add a Comment: </label> */}
                            <input className="add-comment" id="comment" type="text" placeholder="Add a comment..." onChange={(e) => setText(e.target.value)} />
                            <button className="post-btn" onClick={onSubmit}>Post comment</button>
                        </div>

                        <div className='scrollcomment'>
                            <h1 className="posts heading">Comments:</h1>
                            <div className="comment-card">
                                {data.map((d) => (
                                    <>  
                                    <div className='post'>
                                    <div className='user-group-name'>
                                    <label className="username">{"@" + dataPost["user.username"]}</label>
                                    <label className='post-time'>{moment(d.date).format('hh:mm A') + " - " + moment(d.date).format("DD/MM")}</label>
                                    </div>
                                        <p className="post-text">{d.text} </p>
                                        
                                    </div>
                                        

                                    </>

                                ))}
                            </div>
                        </div>
                        

                    </div>
        </div>


            
        </>
    )

}