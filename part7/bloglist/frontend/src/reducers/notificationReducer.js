import { createSlice } from '@reduxjs/toolkit';

window.notificationTimeoutID = 0;

const initialState = '';

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    updateNotification(state, action) {
      return action.payload;
    },
  },
});

export const { updateNotification } = notificationSlice.actions;

export const setNotification = (notification, seconds) => {
  return async (dispatch) => {
    dispatch(updateNotification(notification));
    clearTimeout(window.notificationTimeoutID);

    window.notificationTimeoutID = setTimeout(() => {
      dispatch(updateNotification(''));
    }, seconds * 1000);
  };
};

export default notificationSlice.reducer;
