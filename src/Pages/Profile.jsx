import React, { useContext, useEffect, useState} from 'react';
import { getCurrentUserDetails, uploadImage } from '../apiCalls';
import { useDispatch, useSelector } from 'react-redux';
import Loading from './Loading';
import ProfileDetails from '../Compontes/ProfileDetails';
import Errorpage from './Errorpage';
import {AuthContext} from '../Context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const {user} = useContext(AuthContext);
  const dispatch = useDispatch();
  const [imageUpdated,setImageUpdated] = useState(false);
  const {currentUserDetails}= useSelector((state)=> state.userDetails);

 useEffect(()=>{
    getCurrentUserDetails(currentUserDetails.uid,dispatch);
 },[currentUserDetails.uid,dispatch,imageUpdated]);

  const setProfilePicHandler = async(e)=>{
    try {
      toast(" Uploading Image...",{ style:{color:'white',background: '#4158D0',
      backgroundImage: 'linear-gradient(100deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)'}});
      const image = e.target.files[0];
      await uploadImage(currentUserDetails,image);
      setImageUpdated(true);
    } catch (error) {
      toast.error("Failed to upload image!",{ style:{color:'white',background: '#4158D0',
      backgroundImage: 'linear-gradient(100deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)'}});
    }
  }

  if(!user){
    return <Errorpage/>
  }
  return currentUserDetails?
  (
     <ProfileDetails currentUserDetails={currentUserDetails} setProfilePicHandler={setProfilePicHandler}/>
  )
  :
    (<Loading type={'text'}/>)
}

export default Profile
