
import { createContext, useContext, useState } from "react";

const StateContext = createContext({
  currentUser: null,
  token: null,
  notification: null,
  events: [],
  setUser: () => {},
  setToken: () => {},
  setNotification: () => {},
  setEvents: () => {},
});

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
  const [notification, _setNotification] = useState("");
  const [events, setEvents] = useState([]);


  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  const setNotification = (message) => {
    _setNotification(message);

    setTimeout(() => {
      _setNotification("");
    }, 5000);
  };

  return (
    <StateContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        notification,
        setNotification,
        events,
        setEvents,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
