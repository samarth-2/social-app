import { useState } from "react";

export default function Home() {
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Alice Johnson",
      title: "Best Coffee Ever ☕",
      content: "Just had the best coffee ever!",
      time: "2h ago",
      comments: [
        { id: 1, author: "Bob", text: "Sounds amazing!" },
        { id: 2, author: "Charlie", text: "Where did you get it?" },
      ],
    },
    {
      id: 2,
      author: "Bob Smith",
      title: "Working on a new project 🚀",
      content: "Can't wait to share updates soon!",
      time: "5h ago",
      comments: [],
    },
  ]);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const newPostData = {
      id: Date.now(),
      author: "You",
      title: newPost.title,
      content: newPost.content,
      time: "just now",
      comments: [],
    };
    
    setPosts([newPostData, ...posts]);
    setNewPost({ title: "", content: "" });
  };

  const handleAddComment = (postId, commentText) => {
    if (!commentText.trim()) return;

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                { id: Date.now(), author: "You", text: commentText },
              ],
            }
          : post
      )
    );
  };

  const [commentText, setCommentText] = useState({});

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 py-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {/* LEFT — People */}
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

        {/* RIGHT — Posts */}
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
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
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
            <button
              type="submit"
              className="self-end bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Post
            </button>
          </form>

          <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
          <div className="flex flex-col gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="border-b pb-6 last:border-none space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{post.author}</p>
                  <p className="text-sm text-gray-400">{post.time}</p>
                </div>
                <h3 className="text-lg font-medium">{post.title}</h3>
                <p className="text-gray-700">{post.content}</p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <button className="hover:text-blue-600">Like</button>
                  <button className="hover:text-blue-600">Comment</button>
                  <button className="hover:text-blue-600">Share</button>
                </div>

                {/* Comments */}
                <div className="mt-4 space-y-2">
                  {post.comments.map((c) => (
                    <div key={c.id} className="border rounded-md p-2">
                      <p className="text-sm">
                        <span className="font-medium">{c.author}: </span>
                        {c.text}
                      </p>
                    </div>
                  ))}

                  {/* Add Comment */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddComment(post.id, commentText[post.id] || "");
                      setCommentText((prev) => ({ ...prev, [post.id]: "" }));
                    }}
                    className="flex gap-2 mt-2"
                  >
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText[post.id] || ""}
                      onChange={(e) =>
                        setCommentText((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      className="border rounded-md p-2 flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700 transition"
                    >
                      Post
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
