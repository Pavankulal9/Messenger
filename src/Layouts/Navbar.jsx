import React, { useContext, useEffect, useState } from 'react'
import {signOut} from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom';
import { auth,db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import {BiBell} from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from '../Hooks/auth';
import { getFriendRequest } from '../apiCalls';
const Navbar = () => {

    const {user} = useContext(AuthContext);
    const [requestData,setRequestdata]= useState([]);
    const navigation = useNavigate();
    const {currentUserDetails} = useSelector((state) => state.userDetails);


    const dispatch = useDispatch();
    useEffect(()=>{
     getFriendRequest(setRequestdata);
    },[user]);
    
    const handleLogout=()=>{
      updateDoc(doc(db,'users',currentUserDetails?.uid),{
            isOnline: false,
        })
        signOut(auth);
        dispatch({
          type:'clearCurrentUserDetails',
        });
        navigation('/');
      }
      
      const userRequests = requestData?.filter((data)=> data.to === currentUserDetails?.uid && data.status === 'Request');
      
  
  return (
    <nav className='navbar'>
       <h1><Link to={'/'}>Messenger</Link></h1> 
        {
           currentUserDetails?.uid?(
            <ul>
            <button><Link to={'/profile'}>Profile</Link></button>
            <button onClick={()=> handleLogout()}>Logout</button>
             <Link to={'/request'}><BiBell/>
             {
              userRequests?.length!==0 &&(
              <div className='noti'></div>)
             }
             </Link>
            </ul>
           ):null
        }
    </nav>
  )
}

export default Navbar
