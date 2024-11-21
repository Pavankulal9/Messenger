import React from "react";
import { AiFillWechat } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import User from "./Users";

const UserBox = ({ userFriendList, handleSelectedUser }) => {
  const Navigate = useNavigate();
  //filter based on lastMessage Steps:
  //take UserList and filter with userFriendList so i get all the details of user friends
  //fetch lastMessage using userFriendList userId
  //filter the userFriendList again according to lastMessage read or not

  return (
    <div className="users-container">
      {userFriendList.length > 0 ? (
        userFriendList.map((user) => (
          <User
            key={user.uid}
            user={user}
            handleSelectedUser={handleSelectedUser}
          />
        ))
      ) : (
        <div className="add-user">
          <div>
            <AiFillWechat />
            <h2>Add Users To Start Conversation</h2>
          </div>
        </div>
      )}
      <button onClick={() => Navigate("/addUser")}>Add Users</button>
    </div>
  );
};

export default UserBox;
