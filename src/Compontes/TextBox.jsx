import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import {BiUpload,BiSend} from 'react-icons/bi';
import { db, storage } from '../firebase';
import { Timestamp, addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';

const TextBox = () => {
  const {chat,currentUserDetails} = useSelector((state) => state.userDetails);
  const [text,setText]=useState('');
  const [img,setImg]=useState(0);
  const [previewImage,setPreviewImage] = useState();

  useEffect(()=>{
      setImg();
      setPreviewImage();
  },[chat]);

  const selectImageHandler = (e)=>{
    const img = e.target.files[0];
    setImg(img);
    setPreviewImage(URL.createObjectURL(img));
  }

  const handleSubmit= async(e)=>{
    e.preventDefault();
    const user2= chat.uid;

    const id = currentUserDetails.uid > user2 ? `${currentUserDetails.uid+" "+user2}`:`${user2+" "+currentUserDetails.uid}`;

    let url;
    if(img){
      const imgRef= ref(storage,`images/${new Date().getTime()} - ${img.name}`);
      const snap = await uploadBytes(imgRef, img);
      const dUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url= dUrl;
      setImg(0);
    }

    if(text.length <= 0 && !img){
      return ;
    }else{
    const trimedText = text.trim(); 
    setText('');
    
    try {
      await addDoc(collection(db,'Messages',id,'Chat'),{
        text:trimedText,
        from: currentUserDetails.uid,
        to: user2,
        createdAt: Timestamp.fromDate(new Date()),
        media: url || '',
       });
    } catch (error) {
      console.error(error.message);
    }
  

    try {
      await setDoc(doc(db,'LastMessage',id),{
        text:trimedText,
        from: currentUserDetails.uid,
        to: user2,
        createdAt: Timestamp.fromDate(new Date()),
        media: url || '',
        unread: true
       });
    } catch (error) {
      console.error(error.message);
    }
   
  }
   
  }
  
  return (
    <form className='message-form' onSubmit={handleSubmit}>
      <img src={previewImage} alt="selectedImage" className={img?'seletedImg':'unseletedImg'} />
       <label htmlFor="img">
        <BiUpload/>
      </label>
      <input type="file" 
      files={img}
      accept='image/*'
      onChange={(e)=> selectImageHandler(e)}
      id='img'
      style={{display: 'none'}}
      />
      <div>
        <input type="text" 
        placeholder='Enter the message'
        onChange={(e)=> setText(e.target.value)}
        value={text}
        />
      </div>
      <div>
        <button className='btn'><BiSend/></button>
      </div>
    </form>
  )
}

export default TextBox
