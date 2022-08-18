import { createSlice } from '@reduxjs/toolkit';

window.errorTimeoutID = 0;

const initialState = '';

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    updateError(state, action) {
      return action.payload;
    },
  },
});

export const { updateError } = errorSlice.actions;

export const setError = (error) => {
  return async (dispatch) => {
    dispatch(updateError(error));
    clearTimeout(window.errorTimeoutID);

    window.errorTimeoutID = setTimeout(() => {
      dispatch(updateError(''));
    }, 5000);
  };
};

export default errorSlice.reducer;
