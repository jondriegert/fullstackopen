import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Blog from './Blog';
import userEvent from '@testing-library/user-event';

describe('<Blog /> displays title and author, but not url or number of likes by default', () => {
  const updateBlog = jest.fn();
  const deleteBlog = jest.fn();

  const blogUser = {
    id: '62e5c1b5894143292edd7b52',
    name: 'unit tester',
  };

  const blogObject = {
    title: 'Test suite blog title',
    author: 'Testing Library',
    url: 'https://testsuite.com',
    likes: 4,
    user: blogUser,
  };

  beforeEach(() => {
    render(
      <Blog
        blog={blogObject}
        updateBlog={updateBlog}
        deleteBlog={deleteBlog}
        user={blogUser}
      />
    );
  });

  test('title visible', async () => {
    const title = screen.getByText('Test suite blog title', { exact: false });
    expect(title).toBeDefined();
  });

  test('author visible', async () => {
    const author = screen.getByText('Testing Library', { exact: false });
    expect(author).toBeDefined();
  });

  test('likes hidden', async () => {
    const likes = screen.getByText('likes: 4', { exact: false });
    expect(likes).toHaveStyle('display: none');
  });

  test('user hidden', async () => {
    const user = screen.getByText('unit tester', { exact: false });
    expect(user).toHaveStyle('display: none');
  });
});

describe('<Blog /> displays url and like when view button clicked', () => {
  const updateBlog = jest.fn();
  const deleteBlog = jest.fn();

  const blogUser = {
    id: '62e5c1b5894143292edd7b52',
    name: 'unit tester',
  };

  const blogObject = {
    title: 'Test suite blog title',
    author: 'Testing Library',
    url: 'https://testsuite.com',
    likes: 4,
    user: blogUser,
  };

  beforeEach(() => {
    render(
      <Blog
        blog={blogObject}
        updateBlog={updateBlog}
        deleteBlog={deleteBlog}
        user={blogUser}
      />
    );
  });

  test('likes visible after button clicked', async () => {
    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);

    const likes = screen.getByText('likes: 4', { exact: false });
    expect(likes).not.toHaveStyle('display: none');
  });

  test('user visible after button clicked', async () => {
    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);

    const userValue = screen.getByText('unit tester', { exact: false });
    expect(userValue).not.toHaveStyle('display: none');
  });
});

describe('<Blog /> like button tests', () => {
  const updateBlog = jest.fn();
  const deleteBlog = jest.fn();

  const blogUser = {
    id: '62e5c1b5894143292edd7b52',
    name: 'unit tester',
  };

  const blogObject = {
    title: 'Test suite blog title',
    author: 'Testing Library',
    url: 'https://testsuite.com',
    likes: 4,
    user: blogUser,
  };

  beforeEach(() => {
    render(
      <Blog
        blog={blogObject}
        updateBlog={updateBlog}
        deleteBlog={deleteBlog}
        user={blogUser}
      />
    );
  });

  test('click like button twice and verify event handle called twice', async () => {
    const user = userEvent.setup();
    const button = screen.getByText('like');
    await user.click(button);
    await user.click(button);

    expect(updateBlog.mock.calls).toHaveLength(2);
  });
});

// const Blog = ({ blog, updateBlog, deleteBlog, user })
/*
    const blogObject = {
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    };
*/
