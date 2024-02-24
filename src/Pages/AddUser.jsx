import { useSelector } from 'react-redux'
import profile from '../Assets/Profile1.png'
import logo from '../Assets/logo.webp'
import { toast } from 'react-hot-toast'
import { getFriendRequest } from '../apiCalls'
import { useEffect, useState,useContext } from 'react'
import { Timestamp, doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import Errorpage from './Errorpage'
import { AuthContext } from '../Hooks/auth'

const AddUser = () => {
    const {user} = useContext(AuthContext)
    const {UserList,currentUserDetails} = useSelector(state=> state.userDetails);
    const [searchText, setSearchText]= useState('');
    const [requestData,setRequestdata]= useState([]);
    const [users,setUsers]= useState();

    useEffect(()=>{
      getFriendRequest(setRequestdata);
    },[]);

    const SearchedUserList = (e)=>{
     setSearchText(e.target.value);
     const SearchResult = UserList.filter((user)=> user.name.includes(searchText)|| user.email.includes(searchText));
     setUsers(SearchResult);
    }


    const SendRequestHandler = async(User)=>{
      const id = `${currentUserDetails.uid + " " + User.uid}`;
       try {
       await setDoc(doc(db,'Friend-Request',id),{
        From: currentUserDetails.uid,
        to: User.uid,
        name: currentUserDetails.name,
        avatar: currentUserDetails.avatar ? currentUserDetails.avatar : '',
        sentAt: Timestamp.fromDate(new Date()),
        status:'Request',
      })
      .catch((err)=>{
        console.log(err);
      });

      toast.success('Request sent succesfully');
     } catch (error) {
      console.log(error);
     }
    }

  if(!user){
    return <Errorpage/>
  }
  return (
    <div className='request'>
      <div className='search-user'>
       <input type="text" placeholder='Enter Users Email' onChange={e=> SearchedUserList(e)} value={searchText}/>
      <div className='searched-user'>
        {
        users && searchText.length > 1 &&
          users.map((user,index)=>(
            <div className={`user`} key={index}>
              <div className="user-container">
                  <div className="user-details">
                    <img src={user.avatar || profile} alt="profile" />
                  </div>
                  <div className='user-name'>
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                    <RequestedUser user={user} requestData={requestData} sendRequest={SendRequestHandler} currentUserDetails={currentUserDetails} />
                  </div> 
              </div>
            </div>
            
          ))

        }
        {
           searchText && users.length===0 &&
                <h3>No user Found named {searchText}</h3>
        }
        {
         searchText==='' && <h3>Searched user above</h3>
        }
      </div>
    </div>
    <div className='animation'><img src={logo} alt="logo" width={200} />
                <h1>Messenger</h1>
     </div>
    </div>
  )
}

const RequestedUser =({user,requestData,sendRequest,currentUserDetails})=>{
  const NonRequestedUser= requestData.filter((data)=> currentUserDetails.uid === data.From && user.uid === data.to);
    return (
      <div className='request-Button'>
        {
          NonRequestedUser.length===0? <button onClick={()=>sendRequest(user)}>Send Request</button>:
          NonRequestedUser.map((data,index)=>(
            user.uid === data.to ? 
            (data.status === 'Request'? <h5 key={index}>Request Sent</h5> : <p key={index}>Friends</p>)
            : 
            <button onClick={()=>sendRequest} key={index}>Send Request</button>
          ))
        }
      </div>
    )
}

export default AddUser;
