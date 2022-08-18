import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './reducers/blogReducer';
import errorReducer from './reducers/errorReducer';
import notificationReducer from './reducers/notificationReducer';
import userReducer from './reducers/userReducer';

// const store = createStore(reducer);

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    error: errorReducer,
    notification: notificationReducer,
    users: userReducer,
  },
});

export default store;
