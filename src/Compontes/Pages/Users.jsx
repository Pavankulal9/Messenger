import React, { useEffect, useState } from "react";
import profile from "../../Assets/Profile1.png";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import LastMessage from "./LastMessage";

const User = ({handleSelectedUser,user}) => {

  const {UserList,chat,currentUserDetails} = useSelector((state) => state.userDetails);
  const [lastMessage, setLastMessage] = useState();
  const [friends,setFriends] = useState([]);

  useEffect(()=>{
      const friends = UserList.filter((presentUser)=> presentUser.uid === user.uid);
      setFriends(friends);

      const user2 = user.uid;
       const id = currentUserDetails.uid > user2 ? `${currentUserDetails.uid + " " + user2}` : `${user2 + " " + currentUserDetails.uid}`;
    
      const unsub = onSnapshot(doc(db, "LastMessage", id), (doc) => {
         setLastMessage(doc.data());
      });

    return ()=> unsub();
  },[UserList,user.uid,currentUserDetails.uid]);


  return friends.map((user) => {
    return (
      <div
        className={`user ${chat.uid === user.uid && "selected-user"}`}
        onClick={() => handleSelectedUser(user)}
        key={user.uid}
      >
        <div className="user-container">
          <div className="user-details">
            <img src={user.avatar || profile} alt="profile" />
          </div>
          <div className={`user-status`}>
            <h4>{user.name}</h4>
            <LastMessage lastMessage={lastMessage} user={user} currentUserDetails={currentUserDetails}/>
          </div>
        </div>
      </div>
    );
  });
};

export default User;
