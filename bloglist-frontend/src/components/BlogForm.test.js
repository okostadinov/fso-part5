import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

describe('<BlogForm />', () => {
  const mockfn = jest.fn();

  const setup = () => {
    const blog = {
      title: 'new blog',
      url: 'url',
    };

    return {
      blog,
      user: userEvent.setup(),
      mockfn,
      // in <BlogForm /> the callback is toggleVisibility passed from Toggleable.js
      // leaving it as is causes an error, since toggleVisibility is not defined
      // for this reason substitute it for a placeholder f-n which simply returns
      ...render(<BlogForm addBlog={mockfn} callback={() => null} />),
    };
  };

  test('makes a correct call with the added blog details', async () => {
    const { user, mockfn, blog } = setup();

    const titleInput = screen.getByLabelText('title:');
    const urlInput = screen.getByLabelText('url:');

    await user.type(titleInput, blog.title);
    await user.type(urlInput, blog.url);
    expect(titleInput.value).toBe('new blog');
    expect(urlInput.value).toBe('url');

    const submitBtn = screen.getByRole('button', { name: /create/i });
    await user.click(submitBtn);
    expect(mockfn).toHaveBeenCalledTimes(1);
    expect(mockfn.mock.calls[0][0]).toBe('new blog');
    expect(mockfn.mock.calls[0][1]).toBe('url');
  });
});
