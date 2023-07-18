import React, { useContext,useEffect, useState} from 'react'
import { AuthContext } from '../../Context/auth'
import logo from '../../Assets/logo.webp'
import profile from '../../Assets/Profile1.png'
import { Link, useNavigate } from 'react-router-dom';
import {onSnapshot,collection, doc, updateDoc, getDoc, query, where} from 'firebase/firestore';
import {auth, db} from '../../firebase'
import User from './Users';
import TextBox from './TextBox';
import Messages from './Messages';
import {AiOutlineArrowLeft,AiFillWechat} from 'react-icons/ai'
import { useDispatch } from 'react-redux';
const Home = () => {
  const {user}= useContext(AuthContext);
  const dispatch = useDispatch();
  

    const [usersId,setUsersId]= useState([]);
    const [chat,setChat]=useState('');
    const [back,setBack]=useState(false);

    const Naviagte= useNavigate();

    const user1 = auth?.currentUser?.uid;

    useEffect(()=>{
      if(user){
      const userDetail = collection(db,'AddedUser',user1,'users');
      const unsub = onSnapshot(userDetail, querrySnapShot=>{
        let Addedusers= [];
        querrySnapShot?.forEach((doc)=>{
         Addedusers.push(doc.data());
      })
       setUsersId(Addedusers);
      });

      const userRef = collection(db,'users');
      //* Creating an query for excluding current user from the chat
      const q = query(userRef, where('uid','not-in',[auth.currentUser.uid]));

      //* Exculding the query
      const unsub2 = onSnapshot(q, querrySnapShot=>{
        querrySnapShot.forEach((doc)=>{
        dispatch({
            type: 'searchedUser',
            payload: doc.data(),
        })
      })
      }); 
       
        return ()=>{ unsub(); unsub2();}
      }
    },[user,user1,dispatch]);
    
    const handleSelectedUser = async(user)=>{
      setChat(user);
      const user2 = user.uid;
      const id = user1 > user2 ? `${user1+" "+user2}`:`${user2+" "+user1}`;

      const docSnap = await getDoc(doc(db,'LastMessage',id));
      if(docSnap.data() && docSnap.data().from!== user1){
        await updateDoc(doc(db,'LastMessage',id),{
         unread:false,
        });
      }
      setBack(false);
     }
     

  return (
        user? (
          <div className='home'>
            {
              usersId.length!==0?
              <div className='users-container'>
                    { usersId?.map((user)=>(
                      <User userId={user}  key={user.uid} chat={chat} setChat={setChat} handleSelectedUser={handleSelectedUser} user1={user1}/>
                      ))}  
                     <button onClick={()=> Naviagte('/addUser')}>Add Users</button>
                </div>
                :
              <div className="add-user">
                <div>
                  <AiFillWechat/>
                  <h2>Add yours To start Chatting</h2>
                  <button onClick={()=> Naviagte('/addUser')}>Add Users</button>
                </div>
              </div>
}
                <section className={`message-body ${back? 'open':'close'}`}>
                 {
                  chat?
                  <div className='messages-container'>
                  <div className="message-user">
                    <AiOutlineArrowLeft onClick={()=>setBack(true)}/>
                    <Link><img src={chat?.avatar ? chat.avatar : profile} alt="profile" /></Link>
                    <h4>{chat?.name}</h4>
                  </div>
                  <div className="messages">
                      <Messages user1={user1}  chat={chat}/>
                  </div>
                    <TextBox chat={chat} user1={user1}/>
                </div>
                :
                 <div className='animation'><img src={logo} alt="logo" width={200} />
                   <h1>Messenger</h1>
                </div>
                 }
                </section>
            </div>
        ):(
            <section className='Starting-page'>
              <div className='container'>
                <div>
                    <h1>Messenger</h1>
                    <img src={logo} alt='logo' className='logo'/>
                    <p>Fell Free To Share</p>
                </div>
                <div>
                    
                    <p>New Here?</p>
                    <button><Link to={'/signup'}>SignUp</Link></button>
    
                    <p>or</p>
                    <p>Alreay Registered In?</p>
                    <button><Link to={'/login'}>Login</Link></button>
                </div>
              </div>
            </section>
        )
   )
}

export default Home
