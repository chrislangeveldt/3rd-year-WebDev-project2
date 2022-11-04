import React from "react";
import logo from "../SPOT.svg";
import { useState, useEffect } from "react";

const ShowGroup = () => {
  const [data, setData] = useState([]);
  const [group, setGroup] = useState([]);
  const [user, setUser] = useState([]);

  const handleViewProfile = () => {
    window.location.pathname = "/ViewProfile";
  };

  const handleViewGroups = () => {
    window.location.pathname = "/Groups";
  };

  function makeAdmin(userId) {
    makeUserAdmin(userId);
  }

  function makeUserAdmin(id) {
    const requestOpt = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        group_id: groupId,
        user_id: id,
      }),
    };
    fetch("http://127.0.0.1:5000/admin/make", requestOpt)
      .then((response) => response.json())
      .catch((error) => console.log(error));

    setTimeout(function () {
      window.location.reload();
    }, 20);
  }

  const handleLogout = () => {
    localStorage.clear();
    localStorage.clear();
    window.location.pathname = "/login";
  };

  const handleFriends = () => {
    window.location.pathname = "/Friends";
  };

  const handleHome = (e) => {
    e.preventDefault();
    window.location.pathname = "/";
  };
  const handleGroup = (e) => {
    e.preventDefault();
    window.location.pathname = "/Groups";
  };

  async function getProfile() {
    const response = await fetch(`http://127.0.0.1:5000/profile/my`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
    });
    setUser(await response.json());
    return;
  }

  useEffect(() => {
    getProfile();
  }, []);

  async function getGroupInfo() {
    const response = await fetch(`http://127.0.0.1:5000/group=${groupId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
    });
    setGroup(await response.json());
    return;
  }

  async function leaveGroup(name) {
    const requestOpt = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        name: name,
      }),
    };
    fetch("http://127.0.0.1:5000/group/leave", requestOpt)
      .then((response) => response.json())
      .catch((error) => console.log(error));
    // setTimeout(function () {
    //   window.location.reload();
    // }, 20);
    handleViewGroups();
    return;
  }

  const handleDelete = (groupName) => {
    const requestOpt = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        group_name: groupName,
      }),
    };
    async function fetchFunc() {
      return await fetch(`http://127.0.0.1:5000/group/delete`, requestOpt)
        .then((response) => response.json())
        .catch((error) => console.log(error));
    }
    (async () => {
      await fetchFunc();
    })();
    alert("Deleted " + groupName + " group");
    // window.location.reload();
    handleViewGroups();
    return;
  };

  useEffect(() => {
    getGroupInfo();
  }, []);

  var str = "" + window.location.pathname;
  var groupId = str.substring(str.lastIndexOf("/") + 1, str.length);
  console.log(groupId);

  async function getGroup() {
    const response = await fetch(
      `http://127.0.0.1:5000/users/group=${groupId}`,
      {
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
  useEffect(() => {
    getGroup();
  }, []);

  return (
    <>
      <div className="container">
        <div className="left-side">
              <button className="styleBtn" onClick={handleViewGroups}>
                Back{" "}
              </button>
              <button onClick={handleViewProfile}> Profile</button>                    
              <button className="styleBtn" onClick={handleLogout}>Logout</button>
        </div>

        
        <div className="right-side-groups">
          
        <h1>Group</h1>
        <h3 className="posts heading">{group.name}</h3>
          <div className="group">
            
            <table>
              <tbody>
                <div className="viewgroup">
                  <button className="leaveBtn" onClick={() => leaveGroup(group.name)}>
                    Leave Group
                  </button>
                  {group.admin == 1 ? (
                    <button  className="deleteBtn" onClick={() => handleDelete(group.name)}>
                      Delete Group
                    </button>
                  ) : (
                    <label></label>
                  )}
                </div>
                {data.map((d) => (
                  <>
                    <tr key={d.id}>
                      <td>
                        {d.username === user.username ? (
                          <label className="text2">{d.username}(You)</label>
                        ) : (
                          <div className="admin">
                            {d.admin === 1 ? (
                              <label className="text">{d.username}(Admin)</label>
                            ) : (
                              <label className="text">{d.username}(Member)</label>
                            )}
                          </div>
                        )}
                      </td>
                      <td>
                        {group.admin == 1 ? (
                          <div className="admin">
                            {d.username === user.username ? (
                              <label></label>
                            ) : (
                              <div className="admin">
                                {d.admin === 1 ? (
                                  <label></label>
                                ) : (
                                  <button
                                    className="follow"
                                    onClick={() => {
                                      makeAdmin(d.id);
                                    }}
                                  >
                                    Make Admin
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <label></label>
                        )}
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>










      <h1 className="posts heading">{group.name}</h1>
      <div className="card feed">
        <table>
          <tbody>
            <div>
              <button className="leaveBtn" onClick={() => leaveGroup(group.name)}>
                Leave Group
              </button>
              {group.admin == 1 ? (
                <button onClick={() => handleDelete(group.name)}>
                  Delete Group
                </button>
              ) : (
                <label></label>
              )}
            </div>
            {data.map((d) => (
              <>
                <tr key={d.id}>
                  <td>
                    {d.username === user.username ? (
                      <label>{d.username}(You)</label>
                    ) : (
                      <div>
                        {d.admin === 1 ? (
                          <label>{d.username}(Admin)</label>
                        ) : (
                          <label>{d.username}(Member)</label>
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    {group.admin == 1 ? (
                      <div>
                        {d.username === user.username ? (
                          <label></label>
                        ) : (
                          <div>
                            {d.admin === 1 ? (
                              <label></label>
                            ) : (
                              <button
                                className="follow"
                                onClick={() => {
                                  makeAdmin(d.id);
                                }}
                              >
                                Make Admin
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <label></label>
                    )}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>


      <button className="styleBtn" onClick={handleViewGroups}>
        Back{" "}
      </button>
    </>
  );
};

export default ShowGroup;
