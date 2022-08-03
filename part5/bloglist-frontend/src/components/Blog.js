import PropTypes from 'prop-types';
import { useState } from 'react';

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const deleteStyle = {
    backgroundColor: 'blue',
  };

  const [extended, setExtended] = useState(false);

  const showDelete = {
    display: extended && user.id === blog.user.id ? '' : 'none',
  };
  const showExtended = { display: extended ? '' : 'none' };
  const buttonLabel = extended ? 'hide' : 'view';

  const toggleExtended = () => {
    setExtended(!extended);
  };

  const addLike = () => {
    const blogObject = {
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    };

    updateBlog(blogObject);
  };

  return (
    <div className='blog' style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleExtended}>{buttonLabel}</button>
      </div>
      <div style={showExtended}>{blog.url}</div>
      <div style={showExtended}>
        likes: {blog.likes} <button onClick={addLike}>like</button>
      </div>
      <div style={showExtended}>{blog.user.name}</div>
      <div style={showDelete}>
        <button
          style={deleteStyle}
          onClick={() => {
            deleteBlog(blog);
          }}
        >
          remove
        </button>
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default Blog;
