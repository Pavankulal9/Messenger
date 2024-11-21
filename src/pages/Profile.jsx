import React, { useEffect, useState } from "react";
import { getCurrentUserDetails, uploadImage } from "../utils/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import ProfileDetails from "../components/ProfileDetails";
import ErrorPage from "./ErrorPage";
import toast from "react-hot-toast";

const Profile = () => {
  const dispatch = useDispatch();
  const [imageUpdated, setImageUpdated] = useState(false);
  const { currentUserDetails } = useSelector((state) => state.userDetails);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      getCurrentUserDetails(currentUserDetails.uid, dispatch);
    } catch (error) {
      setError(error.message);
    }
  }, [currentUserDetails.uid, dispatch, imageUpdated]);

  const setProfilePicHandler = async (e) => {
    try {
      toast(" Uploading Image...", {
        style: {
          color: "white",
          background: "#4158D0",
          backgroundImage:
            "linear-gradient(100deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
        },
      });
      const image = e.target.files[0];
      await uploadImage(currentUserDetails, image);
      setImageUpdated(true);
    } catch (error) {
      toast.error("Failed to upload image!", {
        style: {
          color: "white",
          background: "#4158D0",
          backgroundImage:
            "linear-gradient(100deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
        },
      });
    }
  };

  if (error) {
    return <ErrorPage error={error} />;
  }

  return currentUserDetails ? (
    <ProfileDetails
      currentUserDetails={currentUserDetails}
      setProfilePicHandler={setProfilePicHandler}
    />
  ) : (
    <Loading type={"text"} />
  );
};

export default Profile;
