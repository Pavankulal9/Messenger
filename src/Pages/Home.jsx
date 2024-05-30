import React, { useContext,useEffect, useState} from 'react'
import { useDispatch, useSelector} from 'react-redux';
import { getAllUsersDetails, getCurrentUserDetails, getUserFriendList } from '../apiCalls';
import AuthUserComp from '../Compontes/AuthUserComp';
import UnAuthUserComp from '../Compontes/UnAuthUserComp';
import IntroScreen from '../Compontes/IntroScreen';
import {AuthContext} from '../Context/AuthContext';
import Errorpage from './Errorpage';

const Home = () => {
  const {user}= useContext(AuthContext);
  const {currentUserDetails,intialScreenRender} = useSelector((state) => state.userDetails);
  const dispatch = useDispatch();
  const [userFriendList,setUserFriendList] = useState([]);
  const [error,setError]=useState('');
 
  useEffect(()=>{
    setTimeout(()=>{
      dispatch({
        type: 'intialScreenRender'
      });
    },4000);
    
    if(user){
      try {
            getCurrentUserDetails(user.uid,dispatch);
            getAllUsersDetails(user.uid,dispatch);
            getUserFriendList(user.uid,setUserFriendList);
      } catch (error) {
           setError(error.message);
      }    
    }
  },[user,dispatch]);

     if(intialScreenRender){
       return(
        <IntroScreen/>
       )
     }else if(user&&error.length > 0){
        <Errorpage error={error}/>
     }
     else if(user&&currentUserDetails){
       return (
         <AuthUserComp userFriendList={userFriendList} currentUserDetails={currentUserDetails}/>
       )
     }else{
       return (
        <UnAuthUserComp/>
     )}
  }
     

export default Home
