import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile } from "../../api/auth";
import Post from "../post/Post";

export default function ProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setError("No profile found");
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getUserProfile(userId);
        if (!res.user) {
          setError("No profile found");
          setUser(null);
          setPosts([]);
          return;
        }
        setUser(res.user);
        setPosts(res.posts || []);
      } catch (err) {
        setError("Failed to fetch profile");
        setUser(null);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">No profile ID provided</p>
      </div>
    );
  }

  if (loading) {
    return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 flex justify-center">
      <div className="w-full max-w-6xl">
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center mb-10">
          <div className="w-28 h-28 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-4xl font-bold text-gray-600">
            {user.name?.[0] || user.username?.[0]}
          </div>
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-gray-500 text-lg">@{user.username}</p>
          <p className="text-gray-500 mt-1">{user.email}</p>
          <div className="mt-4 flex gap-6">
            <p className="text-gray-700 font-medium">Posts: {posts.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length ? (
            posts.map((post) => <Post key={post._id} post={post} setPosts={setPosts} />)
          ) : (
            <p className="text-gray-500 col-span-full text-center">No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
