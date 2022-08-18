import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { Routes, Route, useMatch } from 'react-router-dom';
import Notification from './components/Notification';
import Error from './components/Error';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';
import userService from './services/users';
import { setNotification } from './reducers/notificationReducer';
import { createBlog, initializeBlogs } from './reducers/blogReducer';
import { initializeUsers } from './reducers/userReducer';
import { setError } from './reducers/errorReducer';
import BlogList from './components/BlogList';
import UserList from './components/UserList';
import Menu from './components/Menu';
import User from './components/User';
import BlogView from './components/BlogView';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(initializeUsers());
  }, [dispatch]);

  const users = useSelector((state) => state.users);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);

      if (users?.length > 0) {
        const userMatch = users.find((u) => u.name === user.name);
        user.id = userMatch.id;
        setUser(user);
        blogService.setToken(user.token);
      }
    }
  }, [users]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });

      const users = await userService.getAll();
      const userMatch = users.find((u) => u.name === user.name);
      user.id = userMatch.id;

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));

      blogService.setToken(user.token);

      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      dispatch(setError('wrong username or password'));
    }
  };

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
  };

  const addBlog = (blogObject) => {
    dispatch(createBlog(blogObject));
    dispatch(
      setNotification(
        `a new blog ${blogObject.title} by ${blogObject.author} added`,
        5
      )
    );
  };

  const loginForm = () => (
    <div>
      <h2>login</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>username:</Form.Label>
          <Form.Control
            type="text"
            name="username"
            onChange={({ target }) => setUsername(target.value)}
          />
          <Form.Label>password:</Form.Label>
          <Form.Control
            type="password"
            onChange={({ target }) => setPassword(target.value)}
          />
          <Button variant="primary" type="submit">
            login
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
  const blogFormRef = useRef();

  const blogForm = () => (
    <Togglable buttonLabel="create new" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  );

  const matchUser = useMatch('/users/:id');
  const userId = matchUser?.params?.id;
  const matchBlog = useMatch('/blogs/:id');
  const blogId = matchBlog?.params?.id;

  return (
    <div className="container">
      <Menu user={user} handleLogout={handleLogout} />
      <h2>blogs app</h2>
      <Error />
      <Notification />
      {user === null ? loginForm() : ''}
      <Routes>
        <Route
          path="/blogs/:id"
          element={<BlogView id={blogId} user={user} />}
        />

        <Route path="/users/:id" element={<User id={userId} />} />
        <Route
          path="/users"
          element={
            <>
              <UserList />
            </>
          }
        />
        <Route
          path="/"
          element={
            <div>
              {user === null ? (
                <></>
              ) : (
                <>
                  <div>{blogForm()}</div>
                  <BlogList user={user} />
                </>
              )}
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
