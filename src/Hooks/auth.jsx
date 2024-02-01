import React,{useState,useEffect, createContext} from 'react'
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from '../firebase';
import Loading from '../Pages/Loading';

export const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user,setUser]=useState();
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        try {
          onAuthStateChanged(auth, user=>{
              setUser(user);
              setLoading(false);
         });
        } catch (error) {
          console.log(error);
      }
    },[user]);
    
    if(loading){
        <Loading/>
    }
  return (
    <AuthContext.Provider value={{user,setUser}}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider
