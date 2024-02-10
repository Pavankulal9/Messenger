import React from 'react'
import {AiOutlineArrowLeft} from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import profile from '../Assets/Profile1.png';
import logo from '../Assets/logo.webp'
import Messages from './Messages';
import TextBox from './TextBox';

const MessageBox = ({back,setBack}) => {
    const {chat} = useSelector((state) => state.userDetails);
    
  return (
    <section className={`message-body ${back? 'open':'close'}`}>
        {
        chat?
        <div className='message-container'> 
            <div className="message-user">
                <AiOutlineArrowLeft onClick={()=>setBack(false)}/>
                <Link><img src={chat?.avatar ? chat.avatar : profile} alt="profile" /></Link>
                <h4>{chat?.name}</h4>
            </div>
            <Messages/>
            <TextBox/>
        </div>
    :
        <div className='animation'>
            <img src={logo} alt="logo" width={200} />
            <h1>Messenger</h1>
        </div>
        }
   </section>
  )
}

export default MessageBox
