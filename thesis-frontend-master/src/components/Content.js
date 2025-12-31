// Libraries
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../App";

// Components

// Styles

const Content = () => {
  const [user] = useContext(UserContext);
  if (!user.access_token) return <NavLink to="/login" />;
  return <div>Content</div>;
};

export default Content;
