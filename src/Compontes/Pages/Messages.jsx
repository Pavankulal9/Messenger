import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { db } from '../../firebase';
import { useSelector } from 'react-redux';

const Messages = () => {
    const {chat,currentUserDetails} = useSelector((state) => state.userDetails);
    const scrollRef= useRef();
    const [messages,setMessages]=useState();
    
    useEffect(()=>{
      setMessages();
      const id = currentUserDetails.uid > chat.uid ? `${currentUserDetails.uid+" "+chat.uid}`:`${chat.uid+" "+currentUserDetails.uid}`;
      
        const msgRef = collection(db,'Messages',id,'Chat')
        const q = query(msgRef,orderBy('createdAt','asc'));
         const unsub = onSnapshot(q, querrySnapShot=>{
         let messages=[];
         querrySnapShot.forEach((doc)=>{
           messages.push(doc.data());
          });
           setMessages(messages);
        });
        
        return ()=> unsub();
        
      },[chat.uid,currentUserDetails.uid]);

      useEffect(()=>{
        scrollRef.current?.scrollIntoView({behavior: 'smooth'});
      },[messages]);

    return messages&& messages.map((message,index)=>(
      <div className={`message-wrapper ${message.from === currentUserDetails.uid? 'mine':''}`} ref={scrollRef} key={index}>
        <div className={`${messages.from === currentUserDetails.uid ? 'myself': 'other'}`}>
          {message.media ? <img src={message.media} alt={message.text}/>:null}
          <p>
           {message.text}
           <small>{message.createdAt?.toDate(new Date().getTime()).toString().slice(16,21)}</small>
          </p>
        </div>
      </div>
    ))
}

export default Messages
