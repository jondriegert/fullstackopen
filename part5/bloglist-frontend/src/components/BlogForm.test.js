import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BlogForm from './BlogForm';
import userEvent from '@testing-library/user-event';

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const addBlog = jest.fn();
  const user = userEvent.setup();

  const { container } = render(<BlogForm createBlog={addBlog} />);

  const sendButton = screen.getByText('create');

  const inputTitle = container.querySelector(`input[name="Title"]`);
  const inputAuthor = container.querySelector(`input[name="Author"]`);
  const inputUrl = container.querySelector(`input[name="Url"]`);

  await user.type(inputTitle, 'testing title input...');
  await user.type(inputAuthor, 'testing author input...');
  await user.type(inputUrl, 'https://urlinput.test');
  await user.click(sendButton);

  expect(addBlog.mock.calls).toHaveLength(1);
  expect(addBlog.mock.calls[0][0].title).toBe('testing title input...');
  expect(addBlog.mock.calls[0][0].author).toBe('testing author input...');
  expect(addBlog.mock.calls[0][0].url).toBe('https://urlinput.test');
});
