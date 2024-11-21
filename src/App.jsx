import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./layout/Navbar";
import { lazy } from "react";
import Home from "./pages/Home";
import "./style/App.scss";
import Loading from "./pages/Loading";
import RequiredAuth from "./components/RequiredAuth";
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const AddUser = lazy(() => import("./pages/AddUser"));
const FriendRequest = lazy(() => import("./pages/FriendRequest"));

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Toaster />
        <Suspense fallback={<Loading type={"text"} />}>
          <Routes>
            <Route path={"/signup"} element={<Signup />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/"} element={<Home />} />
            <Route element={<RequiredAuth />}>
              <Route path={"/profile"} element={<Profile />} />
              <Route path={"/addUser"} element={<AddUser />} />
              <Route path={"/request"} element={<FriendRequest />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
