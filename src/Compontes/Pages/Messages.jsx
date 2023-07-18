import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { db } from '../../firebase';

const Messages = ({user1,chat}) => {
    const scrollRef= useRef();
    const [messages,setMessages]=useState([]);

    

    useEffect(()=>{
      const user2= chat.uid;
       
       const id = user1 > user2 ? `${user1+" "+user2}`:`${user2+" "+user1}`;
       
        const msgRef = collection(db,'Messages',id,'Chat')
        const q = query(msgRef,orderBy('createdAt','asc'));
         const unsub = onSnapshot(q, querrySnapShot=>{
         let messages=[];
         querrySnapShot.forEach((doc)=>{
           messages.push(doc.data());
           console.log(user2);
          });
           setMessages(messages);
        });
        
        return ()=> unsub();
      },[chat.uid,user1])

      useEffect(()=>{
        scrollRef.current?.scrollIntoView({behavior: 'smooth'});
      },[messages]);

    return (
    messages.map((message)=>(
      <div className={`message-wrapper ${message.from === user1? 'mine':''}`} ref={scrollRef}>
        <div className={`${messages.from === user1 ? 'myself': 'other'}`}>
          {message.media ? <img src={message.media} alt={message.text}/>:null}
          <p>
           {message.text}
           <small>{message.createdAt?.toDate(new Date().getTime()).toString().slice(16,21)}</small>
          </p>
        </div>
      </div>
    ))
    )
}

export default Messages
