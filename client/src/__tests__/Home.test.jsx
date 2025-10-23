import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

const mockDispatch = jest.fn();
const mockUseSelector = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (fn) => mockUseSelector(fn),
}));

jest.mock('../components/home/LeftSidebar', () => () => <div>LeftSidebar</div>);
jest.mock('../components/home/RightSidebar', () => () => <div>RightSidebar</div>);
jest.mock('../components/post/Post', () => ({ post }) => <div data-testid="post">{post.title}</div>);

jest.mock('../redux/asyncthunk/postsThunks', () => ({
  createPostThunk: jest.fn(() => ({ type: 'CREATE_POST' })),
  fetchPostsThunk: jest.fn(() => ({ type: 'FETCH_POSTS' })),
}));

jest.mock('../redux/slice/feedSlice', () => ({
  setPage: (p) => ({ type: 'feed/setPage', payload: p }),
}));

jest.mock('react-toastify', () => {
  return { toast: { error: jest.fn(), success: jest.fn() } };
});

const { toast } = require('react-toastify');

import Home from '../components/home/home.jsx';
import { setPage } from '../redux/slice/feedSlice';

describe('Home component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders heading and no posts message when empty', () => {
    mockUseSelector.mockImplementation((selector) =>
      selector({ posts: { items: [], page: 1, totalPages: 1, loading: false } })
    );

    render(<Home />);

    expect(screen.getByText(/How are you feeling today\?/i)).toBeInTheDocument();
    expect(screen.getByText(/No posts yet\./i)).toBeInTheDocument();
  });

  test('shows validation error when fields missing', () => {
    mockUseSelector.mockImplementation((selector) =>
      selector({ posts: { items: [], page: 1, totalPages: 1, loading: false } })
    );

    render(<Home />);

    const submitBtn = screen.getByRole('button', { name: /post/i });
    fireEvent.click(submitBtn);

    expect(toast.error).toHaveBeenCalledWith('All fields required');
  });

  test('shows upload image error when image missing but title/content present', () => {
    mockUseSelector.mockImplementation((selector) =>
      selector({ posts: { items: [], page: 1, totalPages: 1, loading: false } })
    );

    render(<Home />);

    const titleInput = screen.getByPlaceholderText(/Title/i);
    const contentInput = screen.getByPlaceholderText(/Share your thoughts/i);
    fireEvent.change(titleInput, { target: { value: 'Test title' } });
    fireEvent.change(contentInput, { target: { value: 'Test content' } });

    const submitBtn = screen.getByRole('button', { name: /post/i });
    fireEvent.click(submitBtn);

    expect(toast.error).toHaveBeenCalledWith('Upload an image!');
  });

  test('dispatches setPage on pagination buttons', () => {
    mockUseSelector.mockImplementation((selector) =>
      selector({ posts: { items: [], page: 2, totalPages: 3, loading: false } })
    );

    render(<Home />);

    const prevBtn = screen.getByRole('button', { name: /prev/i });
    const nextBtn = screen.getByRole('button', { name: /next/i });

    fireEvent.click(prevBtn);
    expect(mockDispatch).toHaveBeenCalledWith(setPage(1));

    fireEvent.click(nextBtn);
    expect(mockDispatch).toHaveBeenCalledWith(setPage(3));
  });

  test('happy path: creates a post and shows success', async () => {
    mockUseSelector.mockImplementation((selector) =>
      selector({ posts: { items: [], page: 1, totalPages: 1, loading: false } })
    );

    mockDispatch.mockImplementation(() => ({ unwrap: () => Promise.resolve() }));

    const file = new File(['abc'], 'photo.png', { type: 'image/png' });
    global.URL.createObjectURL = jest.fn(() => 'blob:preview');

    const { getByPlaceholderText, getByRole, getByLabelText } = render(<Home />);

    const titleInput = getByPlaceholderText(/Title/i);
    const contentInput = getByPlaceholderText(/Share your thoughts/i);
    const fileInput = document.querySelector('input[type="file"]');

    fireEvent.change(titleInput, { target: { value: 'My title' } });
    fireEvent.change(contentInput, { target: { value: 'Some content' } });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const submitBtn = getByRole('button', { name: /post/i });
  fireEvent.click(submitBtn);

  const { waitFor } = require('@testing-library/react');
  await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Post created!'));

  await waitFor(() => expect(titleInput.value).toBe(''));
  expect(contentInput.value).toBe('');
  });
});
