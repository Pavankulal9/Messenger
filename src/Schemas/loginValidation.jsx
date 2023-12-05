import * as yup from 'yup' ;

export const loginValidation= yup.object({
    email: yup.string().email().min(2).required("Please enter email!"),
    password: yup.string().min(6).required("Please enter password"),
})