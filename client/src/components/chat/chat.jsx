import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { authAxios } from "../../api/axios";
import { socket } from "../../utils/socket";

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await authAxios.post("/chat/get-contacts");
        setUsers(res.data.data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentUser?._id) {
      socket.connect();
      socket.emit("register_user", currentUser._id);
    }
    return () => {
      socket.disconnect();
    };
  }, [currentUser]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (selectedUser && data.senderId === selectedUser._id) {
        setMessages((prev) => [...prev, { ...data, self: false }]);
      }
    });
    return () => socket.off("receive_message");
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const messageObj = {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      message: newMessage,
      time: new Date(),
    };

    setMessages((prev) => [...prev, { ...messageObj, self: true }]);

    socket.emit("send_message", messageObj);
    setNewMessage("");
  };

  return (
    <div className="flex h-[calc(100vh-160px)] bg-white shadow rounded-lg overflow-hidden">

      <div className="w-1/3 border-r border-gray-300 overflow-y-auto">
        <div className="p-4 font-semibold text-gray-700 border-b bg-gray-50">Chats</div>
        {users.map((user) => (
          <div
            key={user._id}
            className={`p-4 cursor-pointer hover:bg-gray-100 ${
              selectedUser?._id === user._id ? "bg-gray-100" : ""
            }`}
            onClick={() => {
              setSelectedUser(user);
              setMessages([]);
            }}
          >
            <div className="font-medium text-gray-800">{user.name}</div>
            <div className="text-sm text-gray-500">@{user.username}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <div>
                <div className="font-semibold text-gray-800">{selectedUser.name}</div>
                <div className="text-sm text-gray-500">@{selectedUser.username}</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.self ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-xs ${
                      msg.self
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-800"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSend}
              className="p-3 border-t flex items-center bg-white"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
