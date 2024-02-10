import React, { useContext, useEffect} from 'react';
import { getCurrentUserDetails, uploadImage } from '../apiCalls';
import { useDispatch, useSelector } from 'react-redux';
import Loading from './Loading';
import ProfileDetails from '../Compontes/ProfileDetails';
import Errorpage from './Errorpage';
import { AuthContext } from '../Hooks/auth';

const Profile = () => {
  const {user} = useContext(AuthContext);
  const dispatch = useDispatch();
  const {currentUserDetails}= useSelector((state)=> state.userDetails);

 useEffect(()=>{
  if(currentUserDetails){
    getCurrentUserDetails(currentUserDetails.uid,dispatch);
  }
 },[currentUserDetails,dispatch]);

  const setProfilePicHandler = async(e)=>{
    const image = e.target.files[0];
    uploadImage(currentUserDetails,image);
  }

  if(!user){
    return <Errorpage/>
  }
  return currentUserDetails?
  (
     <ProfileDetails currentUserDetails={currentUserDetails} setProfilePicHandler={setProfilePicHandler}/>
  )
  :
    (<Loading/>)
}

export default Profile
