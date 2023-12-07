import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import {BiUpload,BiSend} from 'react-icons/bi';
import { db, storage } from '../../firebase';
import { Timestamp, addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';

const TextBox = () => {
  const {chat,currentUserDetails} = useSelector((state) => state.userDetails);
  const [text,setText]=useState('');
  const [img,setImg]=useState();
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
      setImg('');
    }

    if(text===' '&& img === ''){
        return ;
    }else if(text === ''&& img === ''){
      return ;
    }else{
    setText('');
    await addDoc(collection(db,'Messages',id,'Chat'),{
    text,
    from: currentUserDetails.uid,
    to: user2,
    createdAt: Timestamp.fromDate(new Date()),
    media: url || '',
   });

   await setDoc(doc(db,'LastMessage',id),{
    text,
    from: currentUserDetails.uid,
    to: user2,
    createdAt: Timestamp.fromDate(new Date()),
    media: url || '',
    unread: true
   });
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
