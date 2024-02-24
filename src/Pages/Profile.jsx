import React, { useContext, useEffect, useState} from 'react';
import { getCurrentUserDetails, uploadImage } from '../apiCalls';
import { useDispatch, useSelector } from 'react-redux';
import Loading from './Loading';
import ProfileDetails from '../Compontes/ProfileDetails';
import Errorpage from './Errorpage';
import { AuthContext } from '../Hooks/auth';

const Profile = () => {
  const {user} = useContext(AuthContext);
  const dispatch = useDispatch();
  const [imageUpdated,setImageUpdated] = useState(false);
  const {currentUserDetails}= useSelector((state)=> state.userDetails);

 useEffect(()=>{
  setTimeout(()=>{
    getCurrentUserDetails(currentUserDetails.uid,dispatch);
  },3000);
 },[currentUserDetails.uid,dispatch,imageUpdated]);

  const setProfilePicHandler = async(e)=>{
    const image = e.target.files[0];
    uploadImage(currentUserDetails,image);
    setImageUpdated(true);
    getCurrentUserDetails(currentUserDetails.uid,dispatch);
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
