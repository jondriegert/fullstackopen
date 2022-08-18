import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { like, deleteBlog, createComment } from '../reducers/blogReducer';
import { setNotification } from '../reducers/notificationReducer';

const BlogView = ({ id, user }) => {
  const [comment, setComment] = useState('');

  const dispatch = useDispatch();

  const blogs = useSelector((state) => state.blogs);
  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return null;
  }

  const showDelete = {
    display: user?.id === blog.user.id ? '' : 'none',
  };

  const addComment = (event) => {
    event.preventDefault();
    dispatch(createComment(blog, comment));

    setComment('');
  };

  if (!blog) {
    return null;
  }

  return (
    <div>
      <h2>
        {blog.title} {blog.name}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        {blog.likes} likes
        <Button
          variant="primary"
          onClick={() => {
            dispatch(like(blog));
            dispatch(
              setNotification(
                `added like to blog ${blog.title} by ${blog.author}`,
                5
              )
            );
          }}
        >
          like
        </Button>
      </div>
      <div>added by {blog.user.name}</div>
      <div style={showDelete}>
        <Button
          variant="secondary"
          onClick={() => {
            dispatch(deleteBlog(blog));
            dispatch(
              setNotification(`deleted blog ${blog.title} by ${blog.author}`, 5)
            );
          }}
        >
          remove
        </Button>
      </div>
      <h3>comments</h3>
      <form onSubmit={addComment}>
        <div>
          <input
            type="text"
            value={comment}
            name="Comment"
            onChange={({ target }) => setComment(target.value)}
          />
          <button type="submit">add comment</button>
        </div>
      </form>

      {blog.comments.length > 0 && (
        <ul>
          {blog.comments.map((com, i) => (
            <li key={i}>{com}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlogView;
