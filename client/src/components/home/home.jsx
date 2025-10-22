import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Post from "../post/Post";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createPostThunk, fetchPostsThunk } from "../../redux/asyncthunk/postsThunks";
import { setPage } from "../../redux/slice/feedSlice";

export default function Home() {
  const dispatch = useDispatch();
  const { items: posts, page, totalPages, loading } = useSelector((state) => state.posts);

  const [newPost, setNewPost] = useState({ title: "", content: "", imageFile: null });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    dispatch(fetchPostsThunk(page));
  }, [dispatch, page]);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewPost((prev) => ({ ...prev, imageFile: file }));
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const handlePostSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const { title, content, imageFile } = newPost;
      if (!title.trim() || !content.trim()) return toast.error("All fields required");
      if (!imageFile) return toast.error("Upload an image!");

      dispatch(createPostThunk({ title, content, imageFile }))
        .unwrap()
        .then(() => {
          toast.success("Post created!");
          setNewPost({ title: "", content: "", imageFile: null });
          setImagePreview(null);
        })
        .catch((err) => toast.error(err || "Error creating post"));
    },
    [newPost, dispatch]
  );

  const recentPosts = useMemo(() => {
    return posts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [posts]);

  return (
    <div className="bg-gray-50 py-10 px-4 min-h-screen flex justify-center">
      <div className="w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-[0.8fr_3fr_0.8fr] gap-8 mx-auto">
        <div className="hidden md:block">
          <LeftSidebar />
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-semibold mb-5">How are you feeling today?</h2>
            <form onSubmit={handlePostSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Title"
                value={newPost.title}
                onChange={(e) => setNewPost((prev) => ({ ...prev, title: e.target.value }))}
                className="border rounded-md p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <textarea
                placeholder="Share your thoughts..."
                value={newPost.content}
                onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
                className="border rounded-md p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]"
              />
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full rounded-md max-h-72 object-cover"
                />
              )}
              <button
                type="submit"
                className="self-end bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-semibold mb-5">Recent Posts</h2>
            {loading ? (
              <p className="text-gray-500 text-center">Loading...</p>
            ) : recentPosts.length ? (
              <div className="flex flex-col gap-6">
                {recentPosts.map((post) => (
                  <Post key={post._id} post={post} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No posts yet.</p>
            )}
            <div className="flex justify-center mt-6 gap-3">
              <button
                disabled={page === 1}
                onClick={() => dispatch(setPage(page - 1))}
                className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => dispatch(setPage(page + 1))}
                className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
