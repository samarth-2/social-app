
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

jest.mock('../redux/asyncthunk/postsThunks', () => {

  const makeThunk = (baseType, handler) => {
    const fn = (...args) => async (dispatch) => {
      
      dispatch({ type: `${baseType}/pending` });
      const result = await handler(...args);
      dispatch({ type: `${baseType}/fulfilled`, payload: result });
      return result;
    };
    fn.pending = `${baseType}/pending`;
    fn.fulfilled = `${baseType}/fulfilled`;
    fn.rejected = `${baseType}/rejected`;
    return fn;
  };

  return {
    fetchPostsThunk: makeThunk('posts/fetchPosts', async (page) => ({ posts: [], totalPages: 1 })),
    createPostThunk: makeThunk('posts/createPost', async ({ title, content }) => ({ _id: 'p1', title, content, imageUrl: 'http://example.com/img.jpg', createdAt: new Date().toISOString() })),
  };
});

jest.mock('../api/post', () => ({
  createPost: jest.fn(async (title, content, imageUrl) => ({ _id: 'p1', title, content, imageUrl, createdAt: new Date().toISOString() })),
  fetchFeed: jest.fn(async (page) => ({ success: true, posts: [], totalPages: 1 }))
}));

jest.mock('../api/imagekit', () => ({
  upload: (opts, cb) => cb(null, { url: 'http://example.com/img.jpg' })
}));

jest.mock('../components/home/LeftSidebar', () => () => <div>Left</div>);
jest.mock('../components/home/RightSidebar', () => () => <div>Right</div>);
jest.mock('../components/post/Post', () => ({ post }) => <div>{post.title}</div>);

import postsReducer from '../redux/slice/feedSlice';
import Home from '../components/home/home.jsx';

describe('Home integration with redux', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ token: 't', signature: 's', expire: 123 }) }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete global.fetch;
  });

  test('creates a post and updates the store', async () => {
    const store = configureStore({ reducer: { posts: postsReducer } });
    const originalDispatch = store.dispatch.bind(store);
    store.dispatch = (action) => {
      const res = originalDispatch(action);
      if (res && typeof res.then === 'function') {
        res.unwrap = () => res.then((r) => r);
      }
      return res;
    };

    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );

  const { createPostThunk } = require('../redux/asyncthunk/postsThunks');
  await store.dispatch(createPostThunk({ title: 'Integration title', content: 'Integration content' }));

  await waitFor(() => expect(store.getState().posts.items.length).toBe(1));
  expect(store.getState().posts.items[0].title).toBe('Integration title');

  await waitFor(() => expect(screen.getByText(/Integration title/i)).toBeInTheDocument());
  });
});
