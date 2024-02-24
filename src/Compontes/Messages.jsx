import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { db } from '../firebase';
import { useSelector } from 'react-redux';
import PreLoadImage from './PreLoadImage';

const Messages = () => {
    const {chat,currentUserDetails} = useSelector((state) => state.userDetails);
    const scrollRef= useRef(null);
    const [messages,setMessages]=useState([]);
    useEffect(()=>{
      setMessages([]);
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

      const scrollToBottom = () => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current?.scrollHeight;
        }
      };

      useEffect(()=>{
        if(messages){
          setTimeout(() => {
            scrollToBottom();
          }, 1000);
        }
      },[messages]);

    return (
     messages.length > 0 ?
      <div className='messages' ref={scrollRef}>
      {
        messages.map((message)=>
        <div className={`message-wrapper ${message.from === currentUserDetails.uid? 'mine':''}`}>
          <div className={`${messages.from === currentUserDetails.uid ? 'myself': 'other'}`} key={message.createdAt.seconds}>
            {message.media && <PreLoadImage src={message.media}/>}
            <div>
              <p>
              {message.text}
              </p>
              <time>{message.createdAt?.toDate(new Date().getTime()).toString().slice(16,21)}</time>
            </div>
          </div>
        </div>
        )
      }
    </div>
    :
     <div className='messages'>

     </div>
    )
}

export default Messages;
