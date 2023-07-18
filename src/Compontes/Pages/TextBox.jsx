import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react'
import {BiUpload,BiSend} from 'react-icons/bi';
import { db, storage } from '../../firebase';
import { Timestamp, addDoc, collection, doc, setDoc } from 'firebase/firestore';

const TextBox = ({chat,user1}) => {
  const [text,setText]=useState('');
    const [img,setImg]=useState('');

  const handleSubmit= async(e)=>{
    e.preventDefault();
    const user2= chat.uid;

    const id = user1 > user2 ? `${user1+" "+user2}`:`${user2+" "+user1}`;

    let url;
    if(img){
      const imgRef= ref(storage,`images/${new Date().getTime} - ${img.name}`);
      const snap = await uploadBytes(imgRef, img);
      const dUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url= dUrl;
      setImg('');
    }

    if(text===' '||text===''){
          
    }else{
   await addDoc(collection(db,'Messages',id,'Chat'),{
    text,
    from: user1,
    to: user2,
    createdAt: Timestamp.fromDate(new Date()),
    media: url || '',
   });
   
   await setDoc(doc(db,'LastMessage',id),{
    text,
    from: user1,
    to: user2,
    createdAt: Timestamp.fromDate(new Date()),
    media: url || '',
    unread: true
   });
  }
   setText('');
  }
  
  return (
    <form className='message-form' onSubmit={handleSubmit}>
       <label htmlFor="img">
        <BiUpload/>
      </label>
      <input type="file" 
      files={img}
      accept='image/*'
      onChange={(e)=> setImg(e.target.files[0])}
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
