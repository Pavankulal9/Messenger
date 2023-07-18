import { onSnapshot,collection,doc, Timestamp, setDoc, getDoc} from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { auth, db } from '../../firebase'
import { useSelector } from 'react-redux'
import { AuthContext } from '../../Context/auth'
import profile from '../../Assets/Profile1.png'
import logo from '../../Assets/logo.webp'
import { toast } from 'react-hot-toast'
const AddUser = () => {
    const {user}=useContext(AuthContext);
    const {UserList} = useSelector(state=> state.userDetails)


    const [searchText, setSearchText]= useState('');
    const [requestData,setRequestdata]= useState([]);
    const [users,setUsers]= useState();
    const [authUser,setAuthUser]= useState();

    useEffect(()=>{
         if(user){

          getDoc(doc(db,'users',auth.currentUser.uid)).then(docSnap=>{
            setAuthUser(docSnap.data());
          });

      const requestRef = collection(db,'Friend-Request');
      const unsub=onSnapshot(requestRef, querrySnapShot=>{
        let data=[]
      querrySnapShot.forEach((doc)=>{
        data.push(doc.data());
      })
      setRequestdata(data);
     })
     return ()=> unsub();
    }

  },[user]);

   

    const SearchedUserList = (e)=>{
     setSearchText(e.target.value)
     const SearchResult = UserList.filter((user)=> user.name.includes(searchText)|| user.email.includes(searchText));
     setUsers(SearchResult);
    }


    const SendRequestHandler = async(User)=>{
        const id = `${authUser.uid + " " + User.uid}`
     try {
      await setDoc(doc(db,'Friend-Request',id),{
        From: authUser.uid,
        to: User.uid,
        name: authUser.name,
        avatar: authUser.avatar ? authUser.avatar : '',
        sentAt: Timestamp.fromDate(new Date()),
        status:'Request',
      });
      toast.success('Request sent succesfully');
     } catch (error) {
      console.log(error);
     }
    }

    const selectedUser =(user)=>{
      
    }
  return (
    <div className='request'>
      <div className='search-user'>
       <input type="text" placeholder='Enter Users Email' onChange={e=> SearchedUserList(e)} value={searchText}/>
      <div className='searched-user'>
        {
        users && searchText.length > 1 &&
          users.map((user,index)=>(
            <div className={`user`} key={index} onClick={selectedUser(user)}>
            <div className="user-container">
                <div className="user-details">
                <img src={user.avatar || profile} alt="profile" />
                </div>
                <div className='user-name'>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <RequestedUser user={user} requestData={requestData} sendRequest={SendRequestHandler} authUser={authUser}/>
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
                <h1>Messenger</h1></div>
    </div>
  )
}
const RequestedUser =({user,requestData,sendRequest,authUser})=>{
  const NonRequestedUser= requestData.filter((data)=> authUser.uid === data.From && user.uid === data.to);
  console.log(NonRequestedUser);
    return (
      <div className='request-Button'>
        {
          NonRequestedUser.length===0? <button onClick={()=>sendRequest(user)}>Send Request</button>:
          NonRequestedUser.map((data,index)=>(
            user.uid === data.to ? (data.status === 'Request'? <h5 key={index}>Request Sent</h5>: <p key={index}>Friends</p>):<button onClick={()=>sendRequest} key={index}>Send Request</button>
          ))
        }
      </div>
    )
  
}
export default AddUser;
