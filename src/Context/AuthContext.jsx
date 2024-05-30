import React,{useState,useEffect, createContext} from 'react'
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from '../firebase';

export const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user,setUser]=useState(0);

    useEffect(()=>{
        try {
          onAuthStateChanged(auth, user=>{
              setUser(user);
         });
        } catch (error) {
          console.error(error);
      }
    },[user]);
    
  return (
    <AuthContext.Provider value={{user,setUser}}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider
