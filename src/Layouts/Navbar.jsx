import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../utils/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { BiBell } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { getFriendRequest } from "../utils/apiCalls";
import useAuthProvider from "../hooks/useAuthProvider";
const Navbar = () => {
  const { user, setUser } = useAuthProvider();
  const [requestData, setRequestData] = useState([]);
  const navigation = useNavigate();
  const { currentUserDetails } = useSelector((state) => state.userDetails);
  const dispatch = useDispatch();

  useEffect(() => {
    getFriendRequest(setRequestData);
  }, [user]);

  const handleLogout = () => {
    updateDoc(doc(db, "users", currentUserDetails?.uid), {
      isOnline: false,
    });
    dispatch({
      type: "clearCurrentUserDetails",
    });
    setUser(0);
    dispatch({
      type: "addChats",
      payload: "",
    });

    signOut(auth);

    navigation("/");
  };

  const userRequests = requestData?.filter(
    (data) => data.to === currentUserDetails?.uid && data.status === "Request"
  );

  return (
    <nav className="navbar">
      <h1>
        <Link to={"/"}>Messenger</Link>
      </h1>
      {user && currentUserDetails?.uid ? (
        <ul>
          <button>
            <Link to={"/profile"}>Profile</Link>
          </button>
          <button onClick={() => handleLogout()}>Logout</button>
          <Link to={"/request"}>
            <BiBell />
            {userRequests?.length !== 0 && <div className="noti"></div>}
          </Link>
        </ul>
      ) : null}
    </nav>
  );
};

export default Navbar;
