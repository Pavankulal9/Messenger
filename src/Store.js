import {configureStore} from '@reduxjs/toolkit'; 
import {customReducer} from './Reducer'
const store = configureStore({
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
    reducer:{
        userDetails: customReducer, 
    }
});

export default store;