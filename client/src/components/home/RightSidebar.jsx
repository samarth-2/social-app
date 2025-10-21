import { useEffect, useState } from "react";
import { getActiveUsers, getRandomUsers } from "../../api/home"; 

export default function RightSidebar() {
  const [randomUsers, setRandomUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const randomRes = await getRandomUsers();
        console.log(randomUsers);
        setRandomUsers(randomRes.data || []);

        const activeRes = await getActiveUsers();
        setActiveUsers(activeRes.data || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    })();
  }, []);

  const renderAvatar = (user) => {
    const name = user.name || user.username;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  };

  return (
    <div className="space-y-6 sticky top-6 h-fit">
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold mb-3">People You May Know</h2>
        {randomUsers.length ? (
          randomUsers.map((u) => (
            <div key={u._id} className="flex items-center gap-3 py-2 border-b last:border-none">
              <img
                src={renderAvatar(u)}
                alt={u.username}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium">{u.username}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No suggestions right now</p>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold mb-3">Active Users</h2>
        {activeUsers.length ? (
          activeUsers.map((u) => (
            <div key={u._id} className="flex items-center gap-3 py-2 border-b last:border-none">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">{u.username}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No one online</p>
        )}
      </div>
    </div>
  );
}
