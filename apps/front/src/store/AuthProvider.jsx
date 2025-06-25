import { createContext, useContext, useState, useEffect } from "react";
import { getCookie } from "../services/csrf";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const csrftoken = getCookie("csrftoken");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); 

  useEffect(() => {
    fetch("http://localhost:8000/conta/", {
      credentials: "include",
        headers: {
        "X-CSRFToken": csrftoken,
      },
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        console.log("Auth data:", data?.is_authenticated);
        (data?.is_authenticated) ? setUser(data) : setUser(null);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}