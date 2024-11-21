import React from "react";
import { Link } from "react-router-dom";
import logo from "../Assets/logo.webp";

const UnAuthUserComp = () => {
  return (
    <section className="Starting-page">
      <div className="container">
        <div>
          <h1>Messenger</h1>
          <img src={logo} alt="logo" className="logo" />
          <p>Fell Free To Share</p>
        </div>
        <div>
          <p>New Here?</p>
          <button>
            <Link to={"/signup"}>SignUp</Link>
          </button>
          <p>or</p>
          <p>Already Registered In?</p>
          <button>
            <Link to={"/login"}>Login</Link>
          </button>
        </div>
      </div>
    </section>
  );
};

export default UnAuthUserComp;
