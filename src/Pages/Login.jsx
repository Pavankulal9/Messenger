import React, { useContext, useState } from 'react';
import {useFormik} from 'formik';
import {toast} from 'react-hot-toast';
import {signInWithEmailAndPassword} from "firebase/auth";
import {updateDoc,doc} from 'firebase/firestore';
import { loginValidation } from '../Schemas/loginValidation';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import wav from '../Assets/notification.wav'
import { AuthContext } from '../Hooks/auth';
const Login = () => {

const {setUser} = useContext(AuthContext);
const navigate = useNavigate();
const [error,setError]=useState(false);
const [loading,setLoading]=useState(false);

 const initialValues ={
    email:'',
    password:'',
    confirm_password:'',
 }

 const playNoti = new Audio(wav);

    const {values,errors,handleBlur,handleChange,handleSubmit,touched} = useFormik({
        initialValues: initialValues,
        validationSchema: loginValidation,
        onSubmit: async(value,action)=>{
          try {
            setLoading(true);
            const userLoginData = await signInWithEmailAndPassword(
              auth,
              value.email,
              value.password,
            );
              
            await updateDoc(doc(db,'users', userLoginData.user.uid),{
                isOnline: true,
              })
              setError(false);
              setLoading(false);
              action.resetForm();
              toast.success("Login sucessfull",{ style:{color:'white',background: '#4158D0',
              backgroundImage: 'linear-gradient(100deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)'}});
              playNoti.play();
              setUser(userLoginData.user);
              navigate('/');
         } catch (error) {
          setLoading(false);
          setError(error.message.slice(9));
         }
        }
    });

    
  return (
    <div className="signUp-contanier">
    <form onSubmit={handleSubmit}>
        <h1>Login</h1>

      <div className="input-block">
        <input 
         type='email' 
         name='email' 
         id='email'
         placeholder='Email'
         value={values.email}
         onChange={handleChange}
         onBlur={handleBlur} 
         />
         {
            errors.email && touched.email ? <p>{errors.email}</p>: null
         }
      </div>
      <div className="input-block">
        <input 
         type='password' 
         name='password' 
         id='password'
         placeholder='Password'
         value={values.password}
         onChange={handleChange}
         onBlur={handleBlur}
         />
         {
            errors.password && touched.password ? <p>{errors.password}</p>: null
         }
         {
            error && <p>{error}</p>
         }
      </div>
      <div className='submite-button'>
        <button type='submit'>{loading? 'Logging...':'Login'}</button>
      </div>
    </form>

    </div>
  )
}

export default Login

