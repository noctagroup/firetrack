import { createContext, useContext, useState } from 'react';

const FiretrackContext = createContext();

export function FiretrackProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState({});
  const [fenomenoId, setFenomenoId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [period, setPeriod] = useState({ start: '', end: '' });
  const [aoi, setAoi] = useState([]);

  return (
    <FiretrackContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        fenomenoId,
        setFenomenoId,
        selectedProduct,
        setSelectedProduct,
        period,
        setPeriod,
        aoi,
        setAoi
      }}
    >
      {children}
    </FiretrackContext.Provider>
  );
}

export function useFiretrack() {
  return useContext(FiretrackContext);
}
