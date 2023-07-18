import React, { useContext, useEffect, useState } from 'react'
import {signOut} from 'firebase/auth'
import { AuthContext } from '../../Context/auth'
import { Link, useNavigate } from 'react-router-dom';
import { auth,db } from '../../firebase';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import {BiBell} from 'react-icons/bi'
const Navbar = () => {
    const {user} = useContext(AuthContext);
    const [requestData,setRequestdata]= useState([]);
    const navigation = useNavigate();



    useEffect(()=>{
      const requestRef = collection(db,'Friend-Request');
      onSnapshot(requestRef, querrySnapShot=>{
       let data=[];
       querrySnapShot.forEach((doc)=>{
         data.push(doc.data());
       })
       setRequestdata(data);
      });
    },[user]);
    
    const handleLogout=()=>{
      updateDoc(doc(db,'users',auth?.currentUser?.uid),{
            isOnline: false,
        })
        signOut(auth);
        navigation('/');
      }
      
      const userRequests = requestData?.filter((data)=> data.to === auth?.currentUser?.uid && data.status === 'Request');
      
  return (
    <nav className='navbar'>
       <h1><Link to={'/'}>Messenger</Link></h1> 
        {
           auth.currentUser?(
            <ul>
            <button><Link to={'/profile'}>Profile</Link></button>
            <button onClick={()=> handleLogout()}>Logout</button>
             <Link to={'/request'}><BiBell/></Link>
             {
              userRequests?.length!==0 &&(
              <div className='noti'></div>)
             }
            </ul>
           ):null
        }
     
    </nav>
  )
}

export default Navbar
