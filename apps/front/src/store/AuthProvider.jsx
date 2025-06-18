import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); 

  useEffect(() => {
    fetch("https://api.firetrack.nocta-software-dsm.com/conta/", {
      credentials: "include",

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