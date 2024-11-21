import React, { useState } from "react";
import UserBox from "./UserBox";
import MessageBox from "./MessageBox";
import { useDispatch } from "react-redux";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

const AuthUserComp = ({ userFriendList, currentUserDetails }) => {
  const [back, setBack] = useState(false);
  const dispatch = useDispatch();

  const handleSelectedUser = async (selectedUser) => {
    dispatch({
      type: "addChats",
      payload: selectedUser,
    });

    const id =
      currentUserDetails.uid > selectedUser.uid
        ? `${currentUserDetails.uid + " " + selectedUser.uid}`
        : `${selectedUser.uid + " " + currentUserDetails.uid}`;

    const docSnap = await getDoc(doc(db, "LastMessage", id));

    if (docSnap.data() && docSnap.data().from !== currentUserDetails) {
      await updateDoc(doc(db, "LastMessage", id), {
        unread: false,
      });
    }
    setBack(true);
  };

  return (
    <div className="home">
      <UserBox
        userFriendList={userFriendList}
        handleSelectedUser={handleSelectedUser}
      />
      <MessageBox back={back} setBack={setBack} />
    </div>
  );
};

export default AuthUserComp;
