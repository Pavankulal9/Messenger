import React, { useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { signUpValidation } from "../schema";
import { auth, db } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import useAuthProvider from "../hooks/useAuthProvider";
import FormCreator from "../components/FormCreator";

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirm_password: "",
};

const inputs = [
  {
    name: "name",
    type: "text",
    label: "User-Name",
    placeholder: "Enter Name",
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter Email",
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Enter Password",
  },
  {
    name: "confirm_password",
    type: "password",
    label: "Confirm-Password",
    placeholder: "Confirm Password",
  },
];

const Signup = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthProvider();
  const [formHandler, setFormHandler] = useState({
    loading: false,
    error: null,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: signUpValidation,
    onSubmit: async (value, action) => {
      try {
        setFormHandler({
          loading: true,
          error: null,
        });

        const userSignUpData = await createUserWithEmailAndPassword(
          auth,
          value.email,
          value.password
        );

        await setDoc(doc(db, "users", userSignUpData.user.uid), {
          uid: userSignUpData.user.uid,
          name: value.name,
          email: value.email,
          createdAt: Timestamp.fromDate(new Date()),
          isOnline: false,
        });

        setFormHandler({
          loading: false,
          error: null,
        });

        action.resetForm();
        toast.success("Registered successfully!", {
          style: {
            color: "white",
            background: "#4158D0",
            backgroundImage:
              "linear-gradient(100deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
          },
        });

        setUser(userSignUpData.user);
        navigate("/");
      } catch (error) {
        setFormHandler({
          loading: false,
          error: error.message.slice(9),
        });
      }
    },
  });

  if (user) {
    navigate("/", { replace: true });
  }

  return (
    <FormCreator
      formik={formik}
      title={"Sign-Up"}
      loading={formHandler.loading}
      errorMessage={formHandler.error}
      inputs={inputs}
      buttonText={"Sign-Up"}
    />
  );
};

export default Signup;
