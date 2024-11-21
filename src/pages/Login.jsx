import React, { useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { loginValidation } from "../schema";
import { auth, db } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import wav from "../Assets/notification.wav";
import useAuthProvider from "../hooks/useAuthProvider";
import FormCreator from "../components/FormCreator";

const initialValues = {
  email: "",
  password: "",
  confirm_password: "",
};

const inputs = [
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
];

const Login = () => {
  const { user, setUser } = useAuthProvider();
  const navigate = useNavigate();
  const [formHandler, setFormHandler] = useState({
    loading: false,
    error: null,
  });

  const NotificationSound = new Audio(wav);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: loginValidation,
    onSubmit: async (value, action) => {
      try {
        setFormHandler({
          loading: true,
          error: null,
        });

        const userLoginData = await signInWithEmailAndPassword(
          auth,
          value.email,
          value.password
        );

        await updateDoc(doc(db, "users", userLoginData.user.uid), {
          isOnline: true,
        });

        setFormHandler({
          loading: false,
          error: null,
        });
        action.resetForm();

        toast.success("Login sucessfull", {
          style: {
            color: "white",
            background: "#4158D0",
            backgroundImage:
              "linear-gradient(100deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
          },
        });

        NotificationSound.play();
        setUser(userLoginData.user);
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
      title={"Sign-In"}
      loading={formHandler.loading}
      errorMessage={formHandler.error}
      inputs={inputs}
      buttonText={"Sign-In"}
    />
  );
};

export default Login;
