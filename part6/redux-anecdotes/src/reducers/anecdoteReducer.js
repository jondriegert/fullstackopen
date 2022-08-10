import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
    changeAnecdote(state, action) {
      const changedAnecdote = action.payload;
      return state.map((anecdote) =>
        anecdote.id !== changedAnecdote.id ? anecdote : changedAnecdote
      );
    },
  },
});

export const { appendAnecdote, setAnecdotes, changeAnecdote } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const vote = (object) => {
  return async (dispatch) => {
    const newAnecdote = { ...object, votes: object.votes + 1 };
    const changedAnecdote = await anecdoteService.update(newAnecdote);
    dispatch(changeAnecdote(changedAnecdote));
  };
};

export default anecdoteSlice.reducer;
