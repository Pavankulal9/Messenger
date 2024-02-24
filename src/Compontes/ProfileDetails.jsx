import React from 'react'
import profile from '../Assets/Profile1.png'
import {FiCamera} from 'react-icons/fi'
import PreLoadImage from './PreLoadImage'

const ProfileDetails = ({currentUserDetails,setProfilePicHandler}) => {
  return (
    <section className='profile-body'>
       <div className='profile-container' >
        <div className="img-container">
         <PreLoadImage src={currentUserDetails.avatar||profile}/>
          <FiCamera />
          <input type="file"
           accept='image/*'
           onChange={e=> setProfilePicHandler(e)} />
        </div>
        <div className="user-info">
            <h3>Name: {currentUserDetails.name}</h3>
            <h4>Email: {currentUserDetails.email}</h4>
            <p>Joined: {currentUserDetails.createdAt.toDate().toString().slice(0,15)}</p>
        </div>
       </div>
    </section>
  )
}

export default ProfileDetails
