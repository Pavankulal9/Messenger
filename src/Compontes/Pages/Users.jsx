import React, { useState } from 'react'
import profile from '../../Assets/Profile1.png'
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useSelector } from 'react-redux';
const User = ({userId,chat,handleSelectedUser,user1}) => {
  const {UserList}= useSelector(state=> state.userDetails);
  const [lastMessage,setLastMessage]=useState('');

   const users = UserList.filter((user)=> user.uid === userId.uid);
 console.log(users);
  return (
   users.map((user)=>{
    const user2 = user.uid;
    const id = user1 > user2 ? `${user1+' '+user2}`: `${user2+' '+user1}`
       onSnapshot(doc(db,'LastMessage',id),(doc)=>{
       setLastMessage(doc.data());
    });
   return <div className={`user ${chat.uid === user.uid && 'selected-user'}`} onClick={()=> handleSelectedUser(user)} key={user.uid}>
          <div className="user-container">
          <div className="user-details">
            <img src={user.avatar || profile } alt="profile" />
          </div>
            <div className={`user-status`} >
            <h4>{user.name}</h4>
            <p className={lastMessage && lastMessage.from===user.uid && lastMessage.unread === true ? 'unread': 'read'}><strong>{lastMessage && lastMessage.from===user1 ? 'Me:': ''}</strong>{lastMessage && lastMessage.text }</p>
            </div>
          </div>
          </div>
  })
  )
}

export default User
