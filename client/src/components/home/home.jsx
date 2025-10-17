import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createPostThunk, fetchPostsThunk } from "../../redux/asyncthunk/postsThunks";
import { setPage } from "../../redux/slice/feedSlice";
import Post from "../post/Post";

export default function Home() {
  const dispatch = useDispatch();
  const { items: posts, page, totalPages, loading } = useSelector((state) => state.posts);

  const [newPost, setNewPost] = useState({ title: "", content: "", imageFile: null });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    dispatch(fetchPostsThunk(page));
  }, [dispatch, page]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewPost({ ...newPost, imageFile: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const { title, content, imageFile } = newPost;

    if (!title.trim() || !content.trim()) return toast.error("All fields required");
    if (!imageFile) return toast.error("Upload an image!");

    dispatch(createPostThunk({ title, content, imageFile }))
      .unwrap()
      .then(() => {
        toast.success("Post created successfully!");
        setNewPost({ title: "", content: "", imageFile: null });
        setImagePreview(null);
      })
      .catch((err) => toast.error(err || "Error creating post"));
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 py-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {/* Sidebar */}
        <div className="bg-white rounded-2xl shadow p-6 h-fit md:sticky md:top-24">
          <h2 className="text-xl font-semibold mb-4">People you may know</h2>
          {["Alice", "Bob", "Charlie"].map((name, i) => (
            <div key={i} className="flex items-center justify-between border-b pb-3 last:border-none">
              <div>
                <p className="font-medium">{name}</p>
                <p className="text-sm text-gray-500">@{name.toLowerCase()}</p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition">
                Follow
              </button>
            </div>
          ))}
        </div>

        {/* Feed */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Create a Post</h2>

          <form onSubmit={handlePostSubmit} className="flex flex-col gap-3 mb-8 border-b pb-6">
            <input
              type="text"
              placeholder="Title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <textarea
              placeholder="What's on your mind?"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border rounded-md p-2 w-full"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full rounded-md max-h-64 object-cover"
              />
            )}

            <button
              type="submit"
              className="self-end bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </form>

          <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>

          {loading ? (
            <p className="text-gray-500 text-center">Loading posts...</p>
          ) : posts.length ? (
            <div className="flex flex-col gap-6">
              {posts.map((post) => (
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
    </div>
  );
}
