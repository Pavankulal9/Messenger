import React, { useContext,useEffect, useState} from 'react'
import { AuthContext } from '../Hooks/auth';
import { useDispatch, useSelector} from 'react-redux';
import { getAllUsersDetails, getCurrentUserDetails, getUserFriendList } from '../apiCalls';
import AuthUserComp from '../Compontes/AuthUserComp';
import UnAuthUserComp from '../Compontes/UnAuthUserComp';

const Home = () => {
  const {user}= useContext(AuthContext);
  const {currentUserDetails} = useSelector((state) => state.userDetails);
  const dispatch = useDispatch();
  
  const [userFriendList,setUserFriendList] = useState([]);
 

  useEffect(()=>{
      if(user){
          getCurrentUserDetails(user.uid,dispatch);
          getAllUsersDetails(user.uid,dispatch);
          getUserFriendList(user.uid,setUserFriendList);
      }
  },[user,dispatch]);

    
  

     if(user&&userFriendList&&currentUserDetails){
      return (
         <AuthUserComp userFriendList={userFriendList} currentUserDetails={currentUserDetails}/>
        )
     }else{
       return (
        <UnAuthUserComp/>
    )}
  }
     

export default Home
