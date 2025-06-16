import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/conta/", {
      credentials: "include",
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        console.log("Auth data:", data?.is_authenticated);
        (data?.is_authenticated) ? setUser(data) : setUser(null);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}