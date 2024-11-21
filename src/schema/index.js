import * as yup from 'yup' ;

export const loginValidation= yup.object({
    email: yup.string().email().min(2).required("Please enter email!"),
    password: yup.string().min(6).required("Please enter password"),
})

export const signUpValidation = yup.object({
    name: yup.string().min(2).max(25).required("Please enter your name"),
    email: yup.string().email().required('Please enter your email'),
    password: yup.string().min(6).required('Please enter your password'),
    confirm_password: yup.string().required().oneOf([yup.ref('password'),null],"Password should match!")
})