import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import Error from './components/Error';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';
import userService from './services/users';

const App = () => {
  const [blogs, _setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);

  // exercise 5.9, sort by descending likes
  const setBlogs = (blogList) => {
    _setBlogs(
      blogList.sort((a, b) => {
        return b.likes - a.likes;
      })
    );
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userService.getAll().then((users) => {
        const userMatch = users.find((u) => u.name === user.name);
        user.id = userMatch.id;
      });
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

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
      setErrorMessage('wrong username or password');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
  };

  const addBlog = (blogObject) => {
    blogService.create(blogObject).then((returnedBlog) => {
      // in the returned blog user is the id instead of object
      // following line fixes that so details are displayed correctly
      returnedBlog.user = user;
      setBlogs(blogs.concat(returnedBlog));
      setNotificationMessage(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      );
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    });
  };

  const updateBlog = (blogObject) => {
    blogService.update(blogObject).then((returnedBlog) => {
      setBlogs(
        blogs.map((b) =>
          b.id !== returnedBlog.id ? b : { ...b, likes: returnedBlog.likes }
        )
      );
      setNotificationMessage(
        `added like to blog ${returnedBlog.title} by ${returnedBlog.author}`
      );
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    });
  };

  const deleteBlog = (blogObject) => {
    blogService.remove(blogObject.id).then(() => {
      setBlogs(blogs.filter((b) => b.id !== blogObject.id));
      setNotificationMessage(
        `deleted blog ${blogObject.title} by ${blogObject.author}`
      );
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    });
  };

  const loginForm = () => (
    <>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id='username'
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id='password'
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id='login-button' type='submit'>
          login
        </button>
      </form>
    </>
  );
  const blogFormRef = useRef();

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  );

  return (
    <div>
      <h2>blogs</h2>
      <Error message={errorMessage} />
      <Notification message={notificationMessage} />

      {user === null ? (
        loginForm()
      ) : (
        <>
          <div>
            <p>
              {user.name} logged in
              <button onClick={handleLogout}>logout</button>
            </p>
            {blogForm()}
          </div>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
              user={user}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
