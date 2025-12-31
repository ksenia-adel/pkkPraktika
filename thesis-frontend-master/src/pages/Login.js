// Libraries
import { useEffect, useRef } from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

// Components
import { AuthContext } from "../context/Authentication";

// Styles
import "./Login.css";

const Login = () => {
  const usernameRef = useRef();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const [message, setMessage] = useState(error?.message || null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_STARTED" });

    try {
      const result = await axios.post("/api/auth/login", credentials, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      dispatch({
        type: "LOGIN_SUCCESSFUL",
        payload: result.data.details,
      });
      setCredentials({ username: "", password: "" });
      navigate("/home");
    } catch (err) {
      const msg = err?.response?.data || {
        message: "Serveriga puudub ühendus. Kontakteeruge administraatoriga!",
      };
      dispatch({ type: "LOGIN_FAILED", payload: msg });
      setMessage(msg.message);
      usernameRef.current.focus();
    }
  };

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  useEffect(() => {
    setMessage(null);
  }, [credentials.username, credentials.passwords]);

  //if (user) return <NavLink to="/home" />;
  return (
    <div className="login">
      <form className="login__form">
        <h2>Sisselogimine</h2>
        <div className="login__input">
          <input
            onChange={handleChange}
            type="text"
            id="username"
            placeholder="Kasutajanimi"
            autoComplete="off"
            value={credentials.username}
            required
            ref={usernameRef}
          />
          <input
            onChange={handleChange}
            type="password"
            id="password"
            placeholder="Parool"
            value={credentials.password}
            required
          />
          <button
            disabled={
              loading ||
              credentials.username === "" ||
              credentials.password === ""
            }
            onClick={handleSubmit}
          >
            Logi sisse
          </button>
        </div>
        {message && <span>{message}</span>}
      </form>
    </div>
  );
};

export default Login;
