import { collection, doc, getDoc, onSnapshot,setDoc,updateDoc,deleteDoc,Timestamp} from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../firebase';
import profile from '../../Assets/Profile1.png'
import { useDispatch} from 'react-redux';
import { toast } from 'react-hot-toast';
import wav from '../../Assets/notification.wav';

const FriendRequest = () => {
  
  const [requestData,setRequestdata]= useState([]);
  const [authUser,setAuthUser]= useState();
  const dispatch = useDispatch();
  const playNoti = new Audio(wav);
  useEffect(()=>{
      getDoc(doc(db,'users',auth.currentUser.uid)).then(docSnap=>{
        setAuthUser(docSnap.data());
      });
   
    const requestRef = collection(db,'Friend-Request');
     const unsub= onSnapshot(requestRef, querrySnapShot=>{
      let data=[];
      querrySnapShot.forEach((doc)=>{
        data.push(doc.data());
      })
      setRequestdata(data);
     });
     return ()=> unsub();
  },[]);

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
      payload2: authUser,
    })
  });
  console.log('Not this')
 } catch (error) {
  console.log(error,'Request not present');
  //! if current user have not sent request then then an request is sent Accepted
  const id = `${authUser.uid +" "+ user.From}`
  await setDoc(doc(db,'Friend-Request',id),{
    From: authUser.uid,
    to: user.From,
    name:authUser.name,
    avatar: authUser.avatar ? authUser.avatar : '',
    sentAt: Timestamp.fromDate(new Date()),
    status:'Accepted',
  });
  //! Then Requested user is added to the Current users AddedUser Array in database
  await getDoc(doc(db,'users',user.From)).then(docSnap=>{
    dispatch({
      type: 'AddedIfNotPresent',
      payload: docSnap.data(),
      payload2: authUser,
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
    <section className='home'>
    <div className='users-container'>
            <UserRequest  requestData={requestData} auth={auth} AcceptRequestHandler={AcceptRequestHandler} RejectRequestHandler={RejectRequestHandler} playNoti={playNoti}/>
    </div>
    </section>
  )
}
const UserRequest=({requestData,auth,AcceptRequestHandler,RejectRequestHandler})=>{
  const userRequests = requestData.filter((data)=> data.to === auth.currentUser.uid && data.status === 'Request');
  return userRequests.length!==0?(
    userRequests.map((user,index)=>(
        <div className={`user`} key={index}>
            <div className="user-container">
                <div className="user-details">
                <img src={user.avatar || profile} alt="profile" />
                </div>
                <div className='btn'>
                <h4>{user.name}</h4>
                 <button onClick={()=> AcceptRequestHandler(user)}>Accept</button>
                 <button onClick={()=> RejectRequestHandler(user)}>Reject</button>
                </div> 
            </div>
      </div>
    ))
  ):(
    <div className='home'>
      <h4>No User Request Present</h4>
    </div>
  )  
}
export default FriendRequest
