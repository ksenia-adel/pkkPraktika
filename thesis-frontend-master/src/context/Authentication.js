import { createContext, useEffect, useReducer } from "react";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: "",
  accessToken: null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_STARTED":
      return {
        user: null,
        loading: true,
        error: null,
        accessToken: null,
      };
    case "LOGIN_SUCCESSFUL":
      return {
        user: action.payload,
        loading: false,
        error: null,
        accessToken: action.payload.accessToken,
      };
    case "LOGIN_FAILED":
      return {
        user: null,
        loading: false,
        error: action.payload,
        accessToken: null,
      };
    case "LOGOUT":
      return {
        user: null,
        loading: false,
        error: null,
        accessToken: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        accessToken: state.accessToken,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
