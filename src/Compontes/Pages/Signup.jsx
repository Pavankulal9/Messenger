import React, { useState } from 'react';
import {useFormik} from 'formik';
import {toast} from 'react-hot-toast';
import {createUserWithEmailAndPassword} from "firebase/auth";
import {setDoc,doc,Timestamp} from 'firebase/firestore';
import { signUpShema } from '../../Schemas';
import { auth, db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
const Signup = () => {

const navigate = useNavigate();
const [error,setError]=useState(false);
const [loading,setLoading]=useState(false);
 const initialValues ={
    name:'',
    email:'',
    password:'',
    confirm_password:''
 }

    const {values,errors,handleBlur,handleChange,handleSubmit,touched} = useFormik({
        initialValues: initialValues,
        validationSchema: signUpShema,
        onSubmit: async(value,action)=>{
          try {
            const userSignUpData = await createUserWithEmailAndPassword(
              auth,
              value.email,
              value.password,
              );
              
            await setDoc(doc(db,'users', userSignUpData.user.uid),{
                uid: userSignUpData.user.uid,
                name: value.name,
                email:value.email,
                createdAt: Timestamp.fromDate(new Date()),
                isOnline: false,
              })
              setError(false);
              setLoading(false);
              action.resetForm();
              toast.success("Register sucessfull!",{ style:{color:'white',background: '#4158D0',
              backgroundImage: 'linear-gradient(100deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)'}});
              navigate('/login');
    
         } catch (error) {
          setLoading(false)
          setError(error.message.slice(9));
         }
        }
    })
  return (
    <div className="signUp-contanier">
    <form onSubmit={handleSubmit}>
        <h1>Sign-Up</h1>
      <div className="input-block">
        <input 
         type='name'
         name='name' 
         id='name'
         placeholder='Name'
         value={values.name}
         onChange={handleChange}
         onBlur={handleBlur} 
         />
         {
            errors.name && touched.name ? <p>{errors.name}</p>: null
         }
      </div>
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
      </div>
      <div className="input-block">
        <input 
        type='password' 
        name='confirm_password'
        id='confirm_password'
        placeholder='Confirm Password'
        value={values.confirm_password}
        onChange={handleChange}
        onBlur={handleBlur}
        />
        {
         errors.confirm_password && touched.confirm_password ? <p>{errors.confirm_password}</p>: null
        }
        {
          error && <p>{error}</p>
        }
      </div>
      <div className="btn">
        <button type='submit' onClick={()=> setLoading(true)}>{loading ? 'Creating...' : 'SignUp'}</button>
      </div>
    </form>

    </div>
  )
}

export default Signup
