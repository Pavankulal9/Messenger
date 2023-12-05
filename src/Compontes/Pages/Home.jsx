import React, { useContext,useEffect, useState} from 'react'
import { AuthContext } from '../../Context/auth'
import logo from '../../Assets/logo.webp'
import profile from '../../Assets/Profile1.png'
import { Link, useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc} from 'firebase/firestore';
import {db} from '../../firebase'
import User from './Users';
import TextBox from './TextBox';
import Messages from './Messages';
import {AiOutlineArrowLeft,AiFillWechat} from 'react-icons/ai'
import { useDispatch, useSelector} from 'react-redux';
import { getAllUsersDetails, getCurrentUserDetails, getUserFriendList } from '../../apiCalls';

const Home = () => {
  const {user}= useContext(AuthContext);
  const {chat,currentUserDetails} = useSelector((state) => state.userDetails);
  const dispatch = useDispatch();
  const Naviagte= useNavigate();
  

    const [userFriendList,setUserFriendList] = useState();
    const [back,setBack]=useState(false);

    useEffect(()=>{
      if(user){
          getCurrentUserDetails(user.uid,dispatch);

          getUserFriendList(user.uid,setUserFriendList);

          getAllUsersDetails(user.uid,dispatch);
      }
    },[user,dispatch]);

    
    const handleSelectedUser = async(selectedUser)=>{
      dispatch({
        type: 'addChats',
        payload: selectedUser,
        });

        const id = currentUserDetails.uid > selectedUser.uid ? `${currentUserDetails.uid+" "+selectedUser.uid}`:`${selectedUser.uid+" "+currentUserDetails.uid}`;

        const docSnap = await getDoc(doc(db,'LastMessage',id));

        if(docSnap.data() && docSnap.data().from!== currentUserDetails){
          await updateDoc(doc(db,'LastMessage',id),{
          unread:false,
          });
        }
        setBack(false);
     }
     

     if(user&&userFriendList&&currentUserDetails){
      return (
          <div className='home'>
            {
              userFriendList.length > 0 && currentUserDetails ?
              <div className='users-container'>
                    { userFriendList.map((user)=>(
                      <User key={user.uid} user={user} handleSelectedUser={handleSelectedUser} />
                      ))}  
                     <button onClick={()=> Naviagte('/addUser')}>Add Users</button>
                </div>
                :
              <div className="add-user">
                <div>
                  <AiFillWechat/>
                  <h2>Add Users To Start Conversation</h2>
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
                      <Messages />
                  </div>
                    <TextBox />
                </div>
                :
                 <div className='animation'><img src={logo} alt="logo" width={200} />
                   <h1>Messenger</h1>
                </div>
                 }
                </section>
            </div>
        )
     }else{
       return (
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
    )}
  }
     

export default Home
