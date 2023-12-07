import {createReducer,createAction} from '@reduxjs/toolkit';
import { setDoc,doc} from 'firebase/firestore';
import { auth, db } from './firebase';

const getAllUsers = createAction('getAllUsers');//searchedUser
const setCurrentUserDeatils = createAction('setCurrentUserDeatils');
const  AcceptedUser = createAction ('AcceptedUser');
const AddedIfNotPresent = createAction('AddedIfNotPresent');
const addChats = createAction('addChats');
const clearCurrentUserDetails = createAction('clearCurrentUserDetails');
const addCurrentUserId =  createAction('addCurrentUserId');

const initialState = {
    currentUserDetails: null,
    UserList: [],
    AddedUsers: [],
    chat:'',
}

export const customReducer = createReducer(initialState,(builder)=>{
  builder
  .addCase(getAllUsers,(state,action)=>{
     const user = action.payload
     const isExisting = state.UserList.find((PresentUser)=> user.uid === PresentUser.uid);
     if(isExisting){
        //  state.UserList.slice(0, state.UserList.length);
        //  state.UserList.push(user);
        }else{
         state.UserList.push(user);
     }
   })
   .addCase(addCurrentUserId,(state,action)=>{
     state.currentUserId = action.payload;
   })

  .addCase(setCurrentUserDeatils,(state,action)=>{
    state.currentUserDetails = action.payload;
  })


   .addCase(AcceptedUser,(state,action)=>{
    state.AddedUsers.splice(0, state.AddedUsers.length);
    state.AddedUsers.push(action.payload);
    console.log(state.AddedUsers,"AcceptedUser");
    state.AddedUsers.map((user)=>{
     const add= setDoc(doc(db,'AddedUser',auth.currentUser.uid,'users',user.uid),{
        uid: user.uid,
      });
      return()=> add();
    })
   })

  .addCase(AddedIfNotPresent,(state,action)=>{
    state.AddedUsers.splice(0, state.AddedUsers.length);
    const authUser = action.payload2;
    state.AddedUsers.push(action.payload);
    state.AddedUsers.map((user)=>{
     const add= setDoc(doc(db,'AddedUser',user.uid,'users',auth.currentUser.uid),{
        uid: authUser.uid,
      });
      return()=> add();
    })
   })

   .addCase(addChats,(state,action)=>{
      state.chat = action.payload;
   })

   .addCase(clearCurrentUserDetails,(state,action)=>{
    state.currentUserDetails = null;
   });
   
})

export default customReducer;