import { collection, doc, getDoc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db ,storage} from "./firebase";
import { getDownloadURL, uploadBytes,deleteObject,ref } from 'firebase/storage';

export const getCurrentUserDetails =async (userId,dispatch)=>{
   try {
      await getDoc(doc(db,'users',userId)).then(docSnap=>{ dispatch({
         type:'setCurrentUserDetails',
         payload: docSnap.data(),
      });});
   } catch (error) {
      console.log(error);
      return error;
   }
}

export const getUserFriendList =(currentUserId,setUserFriendList)=>{
   try {
      const userDetail = collection(db,'AddedUser',currentUserId,'users');
      onSnapshot(userDetail, querySnapShot=>{
      let usersFriendList=[];
        querySnapShot.forEach((doc)=>{
           usersFriendList.push(doc.data());
          });
         setUserFriendList(usersFriendList);
      })
   } catch (error) {
      console.log(error);
      return error;
   }
}

export const getAllUsersDetails = (currentUser,dispatch)=>{
  try {
   
     const getAllUsers = collection(db,'users');
     //* Creating an query for excluding current user from the users 
     const q = query(getAllUsers, where('uid','not-in',[currentUser]));
     //* Excluding the query
     onSnapshot(q, querySnapShot=>{
       querySnapShot.forEach((doc)=>{
          dispatch({
             type:'getAllUsers',
             payload: doc.data(),
           });
     });
 });
   } catch (error) {
      console.log(error);
      return error;
   }
}

export const uploadImage= async(currentUserDetails,image)=>{
   const imgRef = ref(storage,`avatar/${new Date().getTime()} - ${image.name}`);
    try {
     const snap = await uploadBytes(imgRef,image);
     const url = await getDownloadURL(ref(storage,ref(storage, snap.ref.fullPath)));
     await updateDoc(doc(db,'users',currentUserDetails.uid),{
       avatar: url,
       avatarPath: snap.ref.fullPath
     });
     if(currentUserDetails.avatarPath){
      await deleteObject(ref(storage, currentUserDetails.avatarPath))
    }
    } catch (error) {
     console.log(error);
     return error;
    }
}

   export const getFriendRequest =(setRequestData)=>{
      try {
         const requestRef = collection(db,'Friend-Request');
         onSnapshot(requestRef, querySnapShot=>{
         let data=[]
          querySnapShot.forEach((doc)=>{
            data.push(doc.data());
         })
         setRequestData(data);
        });
      } catch (error) {
         console.log(error);
         return error;
      }
   }

   