import { createSlice } from "@reduxjs/toolkit";

window.timeoutID = 0;

const initialState = "";

const notificationSlice = createSlice({
  name: "notification",
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
    // always clear prev timeoutID or 0, if its invalid id nothing
    // is done, so no harm in always clearing
    clearTimeout(window.timeoutID);
    window.timeoutID = setTimeout(() => {
      dispatch(updateNotification(""));
    }, seconds * 1000);
  };
};

export default notificationSlice.reducer;
