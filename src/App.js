import React, { Suspense } from 'react';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import './App.scss';
import { Toaster } from 'react-hot-toast';
import Navbar from './Compontes/Layouts/Navbar';
import { lazy } from 'react';
const Signup= lazy(()=> import('./Compontes/Pages/Signup') )
const Login= lazy(()=> import('./Compontes/Pages/Login') )
const Home= lazy(()=> import('./Compontes/Pages/Home') )
const Profile = lazy(()=> import('./Compontes/Pages/Profile') )
const AddUser = lazy(()=> import('./Compontes/Pages/AddUser') )
const FriendRequest= lazy(()=> import('./Compontes/Pages/FriendRequest') )

function App() {
  return (
    <div className="App">
        <Router>
          <Navbar/>
          <Toaster/>
          <Suspense fallback={<div className='loading'> <h1>Loading...</h1> </div>}>
          <Routes>
            <Route path={'/'} element={<Home/>}/>
            <Route path={'/signup'} element={<Signup/>}/>
            <Route path={'/login'} element={<Login/>}/>
            <Route path={'/profile'} element={<Profile/>}/>
            <Route path={'/addUser'} element={<AddUser/>}/>
            <Route path={'/request'} element={<FriendRequest/>}/>
          </Routes>
            </Suspense>
        </Router>
    </div>
  );
}

export default App;
