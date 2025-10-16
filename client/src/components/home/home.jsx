import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createPost, fetchFeed } from "../../api/post";
import Post from "../post/Post";
import imagekit from "../../api/imagekit";

export default function Home() {
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const data = await fetchFeed(pageNum);

      if (data.success) {
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      } else {
        toast.error("Failed to load posts");
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNewPost({ ...newPost, imageFile: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handlePostSubmit = async (e) => {
  e.preventDefault();
  const { title, content, imageFile } = newPost;

  if (!title.trim() || !content.trim()) {
    toast.error("Title and content are required!");
    return;
  }

  if (!imageFile) {
    toast.error("Please upload an image!");
    return;
  }

  try {
    setLoading(true);

    const authResponse = await fetch(import.meta.env.VITE_IMAGEKIT_AUTH_ENDPOINT);
    if (!authResponse.ok) throw new Error("Failed to get auth");
    const authData = await authResponse.json();

    const uploadResponse = await new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file: imageFile,
          fileName: `post_${Date.now()}.jpg`,
          folder: "/posts",
          token: authData.token,
          signature: authData.signature,
          expire: authData.expire,
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    const imageUrl = uploadResponse.url;
    console.log(" Image uploaded:", imageUrl);

    await createPost(title, content, imageUrl);

    toast.success("Post created successfully!");
    setNewPost({ title: "", content: "", imageFile: null });
    setImagePreview(null);
    fetchPosts(1);
    setPage(1);
  } catch (err) {
    console.error("Error creating post:", err);
    toast.error("Error creating post");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 py-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        <div className="bg-white rounded-2xl shadow p-6 h-fit md:sticky md:top-24">
          <h2 className="text-xl font-semibold mb-4">People you may know</h2>
          <div className="flex flex-col gap-4">
            {["Alice", "Bob", "Charlie"].map((name, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b pb-3 last:border-none"
              >
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
        </div>

        <div className="md:col-span-2 bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Create a Post</h2>
          <form
            onSubmit={handlePostSubmit}
            className="flex flex-col gap-3 mb-8 border-b pb-6"
          >
            <input
              type="text"
              placeholder="Title"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <textarea
              placeholder="What's on your mind?"
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
              className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
            />

            <div className="flex flex-col gap-2">
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
            </div>

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
          ) : posts.length > 0 ? (
            <div className="flex flex-col gap-6">
              {posts.map((post) => (
                <Post key={post._id} post={post} setPosts={setPosts} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No posts yet.</p>
          )}

          <div className="flex justify-center mt-6 gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
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
