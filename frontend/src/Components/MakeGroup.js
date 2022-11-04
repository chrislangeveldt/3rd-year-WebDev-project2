import React from "react";
import Swal from "sweetalert2";
import { useState} from "react";

const MakeGroup = () => {
  const [group_name, setGroupName] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!group_name) {
      Swal.fire("Please include a group name", "Try again!", "warning");
      return;
    }

    if (group_name.includes("%")) {
      Swal.fire(
        "Group name cannot contain a '%'.",
        " Please try again.",
        "warning"
      );
      return;
    }

    const requestOpt = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        name: group_name,
      }),
    };
    fetch("http://127.0.0.1:5000/group/create", requestOpt)
      .then((response) => response.json())
      .catch((error) => console.log(error));

    setTimeout(function () {
      window.location.reload();
    }, 20);

    setGroupName("");
  };

  return (
    <>
      <h1 className="posts heading">Create a Group</h1>
      <div className="create1">
        {/* <label>{sessionStorage.getItem('token')}</label> */}
        <form className="groups" onSubmit={onSubmit}>
          <div className="form-control">
            <label className="field">Group Name:</label>
            <div className="groups">
            <input
              className="post"
              type="text"
              placeholder="Type group name..."
              onChange={(e) => setGroupName(e.target.value)}
            />
            <button
            className="CreateGroup"
            onClick={() => {
              onSubmit();
            }}
          >
            Create Group
          </button>
            </div>
          </div>

        </form>
      </div>
    </>
  );
};

export default MakeGroup;
