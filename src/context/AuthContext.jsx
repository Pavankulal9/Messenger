import React, { useState, useEffect, createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useDispatch } from "react-redux";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      setTimeout(() => {
        dispatch({
          type: "initialScreenRender",
        });
      }, 4000);
      onAuthStateChanged(auth, (user) => {
        setUser(user);
      });
    } catch (error) {
      console.error(error);
    }
  }, [user, dispatch]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
