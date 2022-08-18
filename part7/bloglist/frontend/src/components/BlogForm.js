import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Button, Row, Col } from 'react-bootstrap';

import { setNotification } from '../reducers/notificationReducer';
import { createBlog } from '../reducers/blogReducer';

const BlogForm = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const dispatch = useDispatch();

  const addBlog = (event) => {
    event.preventDefault();

    const blogObject = {
      title: title,
      author: author,
      url: url,
      likes: 0,
    };

    dispatch(createBlog(blogObject));
    dispatch(
      setNotification(
        `a new blog ${blogObject.title} by ${blogObject.author} added`,
        5
      )
    );

    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <>
      <h2>create new</h2>
      <Form onSubmit={addBlog}>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            title:
          </Form.Label>{' '}
          <Col sm="10">
            <Form.Control
              type="text"
              name="title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            author:
          </Form.Label>{' '}
          <Col sm="10">
            <Form.Control
              type="text"
              name="author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            url:
          </Form.Label>{' '}
          <Col sm="10">
            <Form.Control
              type="text"
              name="url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group>
          <Button variant="primary" type="submit">
            create
          </Button>
        </Form.Group>
      </Form>
    </>
  );
};

export default BlogForm;
