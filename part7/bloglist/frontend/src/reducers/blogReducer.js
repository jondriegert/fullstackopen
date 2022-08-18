import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload);
    },
    setBlogs(state, action) {
      return action.payload;
    },
    changeBlog(state, action) {
      const changedBlog = action.payload;
      return state.map((blog) => {
        return blog.id !== changedBlog.id ? blog : changedBlog;
      });
    },
    removeBlog(state, action) {
      const id = action.payload.id;
      return state.filter((b) => b.id !== id);
    },
  },
});

export const { appendBlog, setBlogs, changeBlog, removeBlog } =
  blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(content);
    dispatch(appendBlog(newBlog));
  };
};

export const like = (object) => {
  return async (dispatch) => {
    const newBlog = { ...object, likes: object.likes + 1 };
    await blogService.update({
      ...newBlog,
      user: newBlog.user.id,
    });
    dispatch(changeBlog(newBlog));
  };
};

export const deleteBlog = (object) => {
  return async (dispatch) => {
    await blogService.remove(object.id);
    dispatch(removeBlog(object));
  };
};

export const createComment = (object, comment) => {
  return async (dispatch) => {
    const newBlog = { ...object, comments: [...object.comments, comment] };
    await blogService.update({
      ...newBlog,
      user: newBlog.user.id,
    });
    dispatch(changeBlog(newBlog));
  };
};

export default blogSlice.reducer;
