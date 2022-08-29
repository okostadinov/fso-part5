import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('<Blog />', () => {
  const mockfn = jest.fn();

  const setup = () => {
    const blog = {
      author: {
        id: '62fb48d1c31c9e13e53fab45',
        name: 'Oleg Kostadinov',
        username: 'okostadinov',
      },
      id: '62fb97872e1267dcb6674485',
      likes: 182,
      title: 'test2',
      url: 'some url',
    };

    return {
      user: userEvent.setup(),
      mockfn,
      ...render(<Blog initBlog={blog} mockfn={mockfn} />),
    };
  };

  test('initially displays only title and author', async () => {
    setup();

    expect(screen.getByText('test2', { exact: false })).toBeInTheDocument();
    expect(
      screen.getByText('Oleg Kostadinov', { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.queryByText('likes', { exact: false })
    ).not.toBeInTheDocument();
    expect(screen.queryByText('some url')).not.toBeInTheDocument();
  });

  test('displays url and likes after button press', async () => {
    const { user } = setup();
    const showBtn = screen.getByText('view');

    await user.click(showBtn);

    expect(screen.getByText('some url')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'hide' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'delete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument();
  });

  test('hides url and likes after second button press', async () => {
    const { user } = setup();
    const showBtn = screen.getByText('view');

    await user.click(showBtn);

    expect(screen.getByText('some url')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'hide' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'delete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument();

    await user.click(showBtn);

    expect(
      screen.queryByText('likes', { exact: false })
    ).not.toBeInTheDocument();
    expect(screen.queryByText('some url')).not.toBeInTheDocument();
  });

  // for this test onClick={handleLike} inside `Blog.js` must be replaced with onClick={mockfn}
  test('clicking the like button twice calls the handler twice', async () => {
    const { user, mockfn } = setup();
    const showBtn = screen.getByText('view');
    await user.click(showBtn);

    const likeBtn = screen.getByRole('button', { name: /like/i });

    await user.click(likeBtn);
    await user.click(likeBtn);

    expect(mockfn).toHaveBeenCalledTimes(2);
  });
});
