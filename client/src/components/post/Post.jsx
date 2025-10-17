import { useState } from "react";
import { createComment } from "../../api/comment";

export default function Post({ post, setPosts }) {
  const [commentText, setCommentText] = useState("");

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await createComment(commentText, post._id);

      setPosts((prev) =>
        prev.map((p) =>
          p._id === post._id
            ? {
                ...p,
                comments: [
                  ...p.comments,
                  {
                    _id: Date.now(),
                    author: { username: "You" },
                    text: commentText,
                  },
                ],
              }
            : p
        )
      );
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  return (
    <div className="border-b pb-6 last:border-none space-y-3">

      <div className="flex items-center justify-between">
        <p className="font-semibold">
          {post.author?.username || post.author?.name || "Unknown User"}
        </p>
        <p className="text-sm text-gray-400">
          {new Date(post.createdAt).toLocaleString()}
        </p>
      </div>


      <h3 className="text-lg font-medium">{post.title}</h3>
      <p className="text-gray-700">{post.content}</p>

      {post.image && (
        <div className="mt-3">
          <img
            src={post.image}
            alt="Post"
            className="w-full rounded-lg object-cover max-h-96 shadow-sm"
          />
        </div>
      )}


      <div className="mt-4 space-y-2">
        {post.comments?.map((c) => (
          <div key={c._id} className="border rounded-md p-2">
            <p className="text-sm">
              <span className="font-medium">
                {c.author?.username || c.author?.name || "Anonymous"}:
              </span>{" "}
              {c.text}
            </p>
          </div>
        ))}

        <form onSubmit={handleAddComment} className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
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
  );
}
