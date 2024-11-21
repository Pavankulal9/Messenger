import {createReducer,createAction} from '@reduxjs/toolkit';
import { setDoc,doc} from 'firebase/firestore';
import { auth, db } from '../firebase';

const getAllUsers = createAction('getAllUsers');
const setCurrentUserDetails = createAction('setCurrentUserDetails');
const  AcceptedUser = createAction ('AcceptedUser');
const AddedIfNotPresent = createAction('AddedIfNotPresent');
const addChats = createAction('addChats');
const clearCurrentUserDetails = createAction('clearCurrentUserDetails');
const addCurrentUserId =  createAction('addCurrentUserId');
const initialScreenRender = createAction('initialScreenRender');

const initialState = {
    currentUserDetails: null,
    UserList: [],
    AddedUsers: [],
    chat:'',
    initialScreenRender: true
}

export const customReducer = createReducer(initialState,(builder)=>{
  builder
  .addCase(initialScreenRender,(state)=>{
      state.initialScreenRender = false;
  })

  .addCase(getAllUsers,(state,action)=>{
     const user = action.payload;
     const isExisting = state.UserList.find((PresentUser)=> user.uid === PresentUser.uid);
     if(isExisting){
      return ;
     }else if(!isExisting){
         state.UserList.push(user);
     }
   })

  .addCase(addCurrentUserId,(state,action)=>{
     state.currentUserId = action.payload;
   })

  .addCase(setCurrentUserDetails,(state,action)=>{
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
    const authUser = action.payload.authUser;
    state.AddedUsers.push(action.payload.data);
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

  .addCase(clearCurrentUserDetails,(state)=>{
    state.currentUserDetails = null;
  });
   
})

export default customReducer;