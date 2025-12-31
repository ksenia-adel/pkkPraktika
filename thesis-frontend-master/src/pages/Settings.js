// Libraries
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import axiosPrivate from "../api/axios";

// Hooks
import { AuthContext } from "../context/Authentication";

// Components

// Icons
import EditButton from "@mui/icons-material/EditOutlined";
import CloseButton from "@mui/icons-material/Close";
import Visible from "@mui/icons-material/Visibility";

// Styles
import "./Common.css";
import "./Settings.css";

const Settings = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const userId = user?.user_id;

  const loc = useLocation();

  const [buttonEnabled, setButtonEnabled] = useState(true);
  const [message, setMessage] = useState(null);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [editingMode, setEditingMode] = useState(false);
  const [userData, setUserData] = useState({
    username: user.username,
    profession: user.profession,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    address: user.address,
  });

  const updateData = async () => {
    try {
      await axiosPrivate.put(`/api/backend/users/${userId}`, {
        data: userData,
      });
    } catch (err) {
      console.log(err.response);
    }
  };

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleUpdate = () => {
    updateData();
    window.location.reload(false);
  };

  useEffect(() => {
    if (loc.pathname !== "/backend/settings") {
      user.is_admin && navigate("/backend/customers");
    }
  }, [user.is_admin, navigate, loc]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axiosPrivate.get(`/api/backend/users/${userId}`);
        setUserData(result.data[0]);
      } catch (err) {
        console.log(err.response);
      }
    };

    fetchUser();
  }, [userId, editingMode]);

  useEffect(() => {
    setMessage(null);
    if (userData.password !== userData.password2 && editingMode) {
      setButtonEnabled(false);
      setMessage("Paroolid ei kattu!");
    } else {
      setButtonEnabled(true);
      setMessage(null);
    }

    if (!editingMode) {
      setUserData((prev) => ({ ...prev, password: "" }));
      setUserData((prev) => ({ ...prev, password2: "" }));
    }
  }, [userData.password, userData.password2, editingMode]);

  return (
    <div className="settings">
      <div className="settings__container">
        <div className="settings__header">
          <h2>Kasutaja sätted</h2>

          {!editingMode ? (
            <EditButton
              className="settings__icon"
              onClick={() => setEditingMode(true)}
              titleAccess="Muuda andmeid"
            />
          ) : (
            <CloseButton
              className="settings__icon"
              onClick={() => setEditingMode(false)}
              titleAccess="Tagasi"
            />
          )}
        </div>

        <form className="settings__form">
          <label className="settings__label">Kasutajanimi</label>
          <input
            className="settings__input"
            type="text"
            value={userData.username}
            id="username"
            onChange={handleChange}
            disabled={!user.is_admin || !editingMode}
            title={
              editingMode && !user.is_admin
                ? "Kasutajanime muutmiseks pöörduge administraatori poole!"
                : ""
            }
          />

          <label className="settings__label">Ametikoht</label>
          <input
            className="settings__input"
            type="text"
            value={userData.profession}
            id="profession"
            onChange={handleChange}
            disabled={!user.is_admin || !editingMode}
            title={
              editingMode && !user.is_admin
                ? "Ametikoha muutmiseks pöörduge administraatori poole!"
                : ""
            }
          />

          <label className="settings__label">Eesnimi</label>
          <input
            className="settings__input"
            type="text"
            id="firstname"
            value={userData.firstname}
            onChange={handleChange}
            disabled={!editingMode}
          />

          <label className="settings__label">Perekonnanimi</label>
          <input
            className="settings__input"
            type="text"
            id="lastname"
            value={userData.lastname}
            onChange={handleChange}
            disabled={!editingMode}
          />

          <label className="settings__label">E-post</label>
          <input
            className="settings__input"
            type="text"
            id="email"
            value={userData.email}
            onChange={handleChange}
            disabled={!editingMode}
          />

          <label className="settings__label">Aadress</label>
          <input
            className="settings__input"
            type="text"
            id="address"
            value={userData.address}
            onChange={handleChange}
            disabled={!editingMode}
          />

          <label className="settings__label">
            Parool
            <p
              hidden={!editingMode}
              onMouseOver={() => setShowPassword1(true)}
              onMouseOut={() => setShowPassword1(false)}
            >
              <Visible className="settings__iconSmall" />
            </p>
          </label>
          <input
            className="settings__input"
            onChange={handleChange}
            type={showPassword1 ? "text" : "password"}
            id="password"
            value={userData?.password}
            placeholder={!editingMode ? "******" : ""}
            disabled={!editingMode}
          />

          <label className="settings__label">
            Kinnita parool{" "}
            <p
              hidden={!editingMode}
              onMouseOver={() => setShowPassword2(true)}
              onMouseOut={() => setShowPassword2(false)}
            >
              <Visible className="settings__iconSmall" />
            </p>
          </label>
          <input
            className="settings__input"
            onChange={handleChange}
            type={showPassword2 ? "text" : "password"}
            id="password2"
            value={userData?.password2}
            placeholder={!editingMode ? "******" : ""}
            disabled={!editingMode}
          />
        </form>
        {message && <span className="message">{message}</span>}
        <button
          hidden={!editingMode || !buttonEnabled}
          onClick={() => handleUpdate()}
        >
          Salvesta muudatused
        </button>
      </div>
    </div>
  );
};

export default Settings;
