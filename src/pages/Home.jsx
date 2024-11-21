import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsersDetails,
  getCurrentUserDetails,
  getUserFriendList,
} from "../utils/apiCalls";
import AuthUserComp from "../components/AuthUserComp";
import UnAuthUserComp from "../components/UnAuthUserComp";
import IntroScreen from "../components/IntroScreen";
import ErrorPage from "./ErrorPage";
import useAuthProvider from "../hooks/useAuthProvider";
import Loading from "./Loading";

const Home = () => {
  const { user } = useAuthProvider();
  const { currentUserDetails, initialScreenRender } = useSelector(
    (state) => state.userDetails
  );
  const dispatch = useDispatch();
  const [userFriendList, setUserFriendList] = useState([]);
  const [stateHandler, setStateHandler] = useState({
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (user) {
      try {
        getCurrentUserDetails(user.uid, dispatch);
        getAllUsersDetails(user.uid, dispatch);
        getUserFriendList(user.uid, setUserFriendList);
        setStateHandler({
          loading: false,
          error: null,
        });
      } catch (error) {
        setStateHandler({
          loading: false,
          error: error.message,
        });
      }
    }

    setStateHandler({
      loading: false,
      error: null,
    });
  }, [user, dispatch]);

  if (initialScreenRender) {
    return <IntroScreen />;
  } else if (stateHandler.loading) {
    return <Loading type={"text"} />;
  } else if (!user) {
    return <UnAuthUserComp />;
  } else if (stateHandler.error) {
    return <ErrorPage error={stateHandler.error} />;
  } else if (user && currentUserDetails) {
    return (
      <AuthUserComp
        userFriendList={userFriendList}
        currentUserDetails={currentUserDetails}
      />
    );
  }
};

export default Home;
