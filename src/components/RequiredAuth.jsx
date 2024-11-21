import React from "react";
import useAuthProvider from "../hooks/useAuthProvider";
import { Navigate, Outlet } from "react-router-dom";

const RequiredAuth = () => {
  const { user } = useAuthProvider();

  const Content = user ? <Outlet /> : <Navigate to={"/"} />;

  return Content;
};

export default RequiredAuth;
