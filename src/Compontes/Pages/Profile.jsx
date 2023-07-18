import React, { useEffect, useState } from 'react';
import profile from '../../Assets/Profile1.png'
import {FiCamera} from 'react-icons/fi'
import { getDoc,doc, updateDoc} from 'firebase/firestore';
import { auth, db ,storage} from '../../firebase';
import { getDownloadURL, uploadBytes,deleteObject,ref } from 'firebase/storage';
import Loading from './Loading';
const Profile = () => {
  const [img,setImg]= useState('');
  const [user,setUser]= useState('');
  

  useEffect(()=>{
    getDoc(doc(db,'users',auth?.currentUser?.uid)).then(docSnap=>{
      if(docSnap.exists){
        setUser(docSnap.data());
      }
     });

     if(img){
      const uploadImage=async()=>{
        const imgRef = ref(storage,`avatar/${new Date().getTime()} - ${img.name}`);
         try {
          if(user.avatarPath){
            await deleteObject(ref(storage, user.avatarPath))
          }
          const snap = await uploadBytes(imgRef,img);
          const url = await getDownloadURL(ref(storage,ref(storage, snap.ref.fullPath)));
          await updateDoc(doc(db,'users',auth.currentUser.uid),{
            avatar: url,
            avatarPath: snap.ref.fullPath
          });
          setImg('');
         } catch (error) {
          console.log(error)
         }
        }
        uploadImage();
     }
  },[img,user.avatarPath,user]);

  return user?(
    <section className='profile-body'>
       <div className='profile-container' >
         <div className="img-container">
          <img src={user.avatar || profile} alt="profile" />
          <FiCamera />
          <input type="file"
          accept='image/*'
          onChange={e=> setImg(e.target?.files[0])} />
         </div>
       <div className="user-info">
        <h3>Name: {user?.name}</h3>
        <h4>Email: {user?.email}</h4>
        <p>Joined: {user?.createdAt.toDate().toString().slice(0,15)}</p>
       </div>
       </div>
    </section>
  ):(<Loading/>)
}

export default Profile
