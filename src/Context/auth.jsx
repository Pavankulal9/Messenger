import React,{useState,useEffect, createContext} from 'react'
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from '../firebase';
import Loading from '../Compontes/Pages/Loading';

export const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user,setUser]=useState();
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
      if(auth){
       return ()=>{
        try {
          onAuthStateChanged(auth, user=>{
              setUser(user);
              setLoading(false);
         });
        } catch (error) {
          console.log(error);
        }
    }
  }
    },[]);
    
    if(loading){
        <Loading/>
    }
  return (
    <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider
