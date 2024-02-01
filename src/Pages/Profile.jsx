import React, { useEffect} from 'react';
import profile from '../Assets/Profile1.png'
import {FiCamera} from 'react-icons/fi'
import Loading from './Loading';
import { getCurrentUserDetails, uploadImage } from '../apiCalls';
import { useDispatch, useSelector } from 'react-redux';
const Profile = () => {

  const dispatch = useDispatch();
  const {currentUserDetails}= useSelector((state)=> state.userDetails);

 useEffect(()=>{
  getCurrentUserDetails(currentUserDetails.uid,dispatch);
 },[currentUserDetails.uid,dispatch]);

  const setProfilePicHandler = async(e)=>{
    const image = e.target.files[0];
    uploadImage(currentUserDetails,image);
  }

  return currentUserDetails?(
    <section className='profile-body'>
       <div className='profile-container' >
         <div className="img-container">
          <img src={currentUserDetails.avatar || profile} alt="profile" />
          <FiCamera />
          <input type="file"
          accept='image/*'
          onChange={e=> setProfilePicHandler(e)} />
         </div>
       <div className="user-info">
        <h3>Name: {currentUserDetails.name}</h3>
        <h4>Email: {currentUserDetails.email}</h4>
        <p>Joined: {currentUserDetails.createdAt.toDate().toString().slice(0,15)}</p>
       </div>
       </div>
    </section>
  ):(<Loading/>)
}

export default Profile
