import React, { useEffect} from 'react';
import { getCurrentUserDetails, uploadImage } from '../apiCalls';
import { useDispatch, useSelector } from 'react-redux';
import Loading from './Loading';
import ProfileDetails from '../Compontes/ProfileDetails';

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
     <ProfileDetails currentUserDetails={currentUserDetails} setProfilePicHandler={setProfilePicHandler}/>
  ):
     (<Loading/>)
}

export default Profile
