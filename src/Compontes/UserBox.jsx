import React from 'react'
import {AiFillWechat} from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import User from './Users';

const UserBox = ({userFriendList,handleSelectedUser}) => {
    const Naviagte = useNavigate();

  return (
    <div className='users-container'>
    { 
      userFriendList.length > 0 ? 
       userFriendList.map((user)=>(
        <User key={user.uid} user={user} handleSelectedUser={handleSelectedUser} />
       ))
      :
       <div className="add-user">
          <AiFillWechat/>
          <h2>Add Users To Start Conversation</h2>
      </div>
    }  
     <button onClick={()=> Naviagte('/addUser')}>Add Users</button>
   </div>
  )
}

export default UserBox
