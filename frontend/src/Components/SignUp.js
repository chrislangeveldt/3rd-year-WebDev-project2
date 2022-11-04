import React from "react";
import Swal from "sweetalert2";

const ImgUpload = ({ onChange, src, value }) => (
  <label htmlFor="photo-upload" className="custom-file-upload fas">
    <div className="img-wrap img-upload">
      <img className="loginimg" src={src} alt="User Avatar" />
    </div>
    <input
      id="avatar_url_upload"
      type="url"
      value={value}
      onChange={onChange}
      placeholder={"Paste URL.."}
      required
    />
  </label>
);

const Username = ({ onChange, value }) => (
  <div className="field">
    <label htmlFor="name">Username:</label>
    <input
      id="name"
      type="text"
      onChange={onChange}
      maxLength="25"
      value={value}
      placeholder="Unique username..."
      required
    />
  </div>
);

const Email = ({ onChange, value }) => (
  <div className="field">
    <label htmlFor="email">Email:</label>
    <input
      id="email"
      type="email"
      onChange={onChange}
      maxLength="25"
      value={value}
      placeholder="jbloggs@mail.com"
      required
    />
  </div>
);

const Password = ({ onChange, value }) => (
  <div className="field">
    <label htmlFor="password">Password:</label>
    <input
      id="password"
      type="password"
      onChange={onChange}
      maxLength="25"
      value={value}
      placeholder="password"
      required
    />
  </div>
);

const handleHome = (e) => {
  e.preventDefault();
  window.location.pathname = "/login";
};

const Profile = ({ onSubmit, src, name, email }) => (
  <div className="card">
    <form onSubmit={onSubmit}>
      <h1>Successfully Registered</h1>
      <label className="custom-file-upload fas">
        <div className="img-wrap">
          <img for="photo-upload" src={src} alt="Upload" />
        </div>
      </label>
      <div className="name">{name}</div>
      <div className="email">{email}</div>
      <button type="submit" className="styleBtn edit">
        Edit Details{" "}
      </button>
    </form>
  </div>
);

const Edit = ({ onSubmit, children }) => (
  <div className="card">
    <form onSubmit={onSubmit}>
      <h1>User Registration</h1>
      {children}
      <div className="edit-btns">
        <button type="submit" className="save-btn">
          Save{" "}
        </button>
        <button className="back-btn" onClick={handleHome}>
          {" "}
          Back{" "}
        </button>        
      </div>
      
    </form>
  </div>
);

class SignUp extends React.Component {
  state = {
    file: "",
    imagePreviewUrl:
      "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true",
    name: "",
    email: "",
    password: "",
    active: "edit",
  };

  photoUpload = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };
  editUsername = (e) => {
    const username = e.target.value;
    this.setState({
      username,
    });
  };

  editEmail = (e) => {
    const email = e.target.value;
    this.setState({
      email,
    });
  };

  editPassword = (e) => {
    const password = e.target.value;
    this.setState({
      password,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let data = this.state;
    var string = "%";
    if (data.username.includes(string)) {
      Swal.fire(
        "Username cannot contain a '%'.",
        " Please try again.",
        "warning"
      );
      return;
    }
    const requestOpt = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: data.username,
        password: data.password,
        email: data.email,
        avatar_url: document.getElementById("avatar_url_upload").value,
      }),
    };

    async function fetchFunc() {
      return await fetch("http://127.0.0.1:5000/register", requestOpt)
        .then((response) => response.json())
        .catch((error) => console.log(error));
    }
    (async () => {
      let info = await fetchFunc();
      if (info.success) {
        window.location.pathname = "/login";
      } else {
        Swal.fire(info.msg, "Try again!", "warning");
      }
    })();
  };

  render() {
    const { imagePreviewUrl, username, email, password, active } = this.state;
    return (
      <div>
        {active === "edit" ? (
          <Edit onSubmit={this.handleSubmit}>
            <ImgUpload onChange={this.photoUpload} src={imagePreviewUrl} />
            <Username onChange={this.editUsername} value={username} />
            <Email onChange={this.editEmail} value={email} />
            <Password onChange={this.editPassword} value={password} />
          </Edit>
        ) : (
          <Profile
            onSubmit={this.handleSubmit}
            src={imagePreviewUrl}
            name={username}
            email={email}
            password={password}
          />
        )}
      </div>
    );
  }
}

export default SignUp;
