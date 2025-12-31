// Libraries
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import axios from "../api/axios";

import logo from "../images/logo_white.png";

// Components
import { AuthContext } from "../context/Authentication";

// Styles
import "./Navigation.css";

const Navigation = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    navigate("/login");
    try {
      await axios.get("/api/logout", {
        withCredentials: true,
      });
      dispatch({ type: "LOGOUT" });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="navigation">
      <div className="navigation__container">
        <Link to="/home">
          <img src={logo} alt="" className="navigation__logo" />
        </Link>
        <div className="navigation__items">
          <NavLink to="/home">
            <button className="navigation__item">Raportid</button>
          </NavLink>
          <NavLink to="/settings">
            <button className="navigation__item">Seaded</button>
          </NavLink>
          <button className="navigation__item" onClick={handleLogout}>
            Logi välja
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
