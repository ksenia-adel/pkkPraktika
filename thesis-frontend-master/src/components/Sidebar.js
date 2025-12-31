// Libraries
import React from "react";
import { Link, useLocation } from "react-router-dom";

// Components

// Styles
import "./Sidebar.css";

function Sidebar({ sidebarData }) {
  const loc = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar__container">
        <ul>
          {sidebarData.map((item, i) => (
            <>
              <p key={i} className="sidebar__title">
                {item.group}
              </p>
              {item.objects.map((obj, _i) => (
                <Link key={_i} className="sidebar__link" to={obj.link}>
                  <li key={_i} id={loc.pathname === obj.link ? "active" : ""}>
                    <div className="sidebar__icon">{obj.icon}</div>
                    <span>{obj.title}</span>
                  </li>
                </Link>
              ))}
            </>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
