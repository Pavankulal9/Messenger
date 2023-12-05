import { doc, getDoc,setDoc,updateDoc,deleteDoc,Timestamp} from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../firebase';
import profile from '../../Assets/Profile1.png'
import { useDispatch, useSelector} from 'react-redux';
import { toast } from 'react-hot-toast';
import wav from '../../Assets/notification.wav';
import { getCurrentUserDetails, getFriendRequest } from '../../apiCalls';

const FriendRequest = () => {
  
  const {currentUserDetails} = useSelector((state) => state.userDetails);
  const [requestData,setRequestdata]= useState([]);
  const dispatch = useDispatch();

  const playNoti = new Audio(wav);

  useEffect(()=>{
      getCurrentUserDetails(currentUserDetails.uid,dispatch);
      getFriendRequest(setRequestdata);
  },[currentUserDetails.uid,dispatch]);

  const AcceptRequestHandler =async(user)=>{
 try {
  await updateDoc(doc(db,'Friend-Request',user.From +" "+user.to),{
    status: 'Accepted',
 });
 
 try {
  await updateDoc(doc(db,'Friend-Request',user.to +" "+user.From),{
    status: 'Accepted',
  });
  //! if both have sent request then both will be added to AddedUser array im databse
  await getDoc(doc(db,'users',user.From)).then(docSnap=>{
    dispatch({
      type: 'AddedIfNotPresent',
      payload: docSnap.data(),
      payload2: currentUserDetails,
    })
  });
 } catch (error) {
  console.log(error,'Request not present');
  //! if current user have not sent request then then an request is sent Accepted
  const id = `${currentUserDetails.uid +" "+ user.From}`
  await setDoc(doc(db,'Friend-Request',id),{
    From: currentUserDetails.uid,
    to: user.From,
    name:currentUserDetails.name,
    avatar: currentUserDetails.avatar ? currentUserDetails.avatar : '',
    sentAt: Timestamp.fromDate(new Date()),
    status:'Accepted',
  });
  //! Then Requested user is added to the Current users AddedUser Array in database
  await getDoc(doc(db,'users',user.From)).then(docSnap=>{
    dispatch({
      type: 'AddedIfNotPresent',
      payload: docSnap.data(),
      payload2: currentUserDetails,
    })
  });
 }

 await getDoc(doc(db,'users',user.From)).then(docSnap=>{
  dispatch({
    type: 'AcceptedUser',
    payload: docSnap.data(),
  })
});

 } catch (error) {
  console.log(error);
 }
}

  const RejectRequestHandler =async(user)=>{
  try {
    await deleteDoc(doc(db,'Friend-Request',user.From +" "+user.to));
    toast.error('Request rejected',{ style:{color:'white',background: '#4158D0',
    backgroundImage: 'linear-gradient(100deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)'}});
    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <section className='friend-list'>
            <UserRequest  requestData={requestData} auth={auth} AcceptRequestHandler={AcceptRequestHandler} RejectRequestHandler={RejectRequestHandler} playNoti={playNoti}/>
    </section>
  )
 
}

const UserRequest=({requestData,auth,AcceptRequestHandler,RejectRequestHandler})=>{
  
  const userRequests = requestData.filter((data)=> data.to === auth.currentUser.uid && data.status === 'Request');

  return userRequests.length!==0?(
    userRequests.map((user)=>(
            <div className="friend-requests" key={user.uid}>
                <div className="user-details">
                <img src={user.avatar || profile} alt="profile" />
                <h4>{user.name}</h4>
                </div>
                <div className='btn'>
                 <button onClick={()=> AcceptRequestHandler(user)}>Accept</button>
                 <button onClick={()=> RejectRequestHandler(user)}>Reject</button>
                </div> 
            </div>
    ))
  ):(
    <div className='loading'>
      <h4>No User Request Present</h4>
    </div>
  )  
}
export default FriendRequest
