import { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Users } from "lucide-react";
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
        const res = await authAxios.post("/chat/get-contacts", { withCredentials: true });
        setUsers(res.data.data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentUser?._id) {
      if (!socket.connected) {
        socket.connect();
      }
      socket.emit("register_user", currentUser._id);
    }
  return () => {};
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
    <div className="flex h-[calc(100vh-160px)] bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">

      <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-4 flex items-center gap-2 text-blue-700 font-semibold border-b border-gray-200 bg-white">
          <Users className="w-5 h-5" />
          Contacts
        </div>

        {users.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-gray-400 text-sm">
            No users available
          </div>
        ) : (
          <div className="overflow-y-auto">
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => {
                  setSelectedUser(user);
                  setMessages([]);
                }}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-blue-50 transition-all ${
                  selectedUser?._id === user._id
                    ? "bg-blue-100 border-l-4 border-blue-500"
                    : ""
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center bg-blue-200 text-blue-800 rounded-full font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm text-gray-500">@{user.username}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 flex items-center justify-between bg-white border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full font-bold">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{selectedUser.name}</div>
                  <div className="text-sm text-gray-500">@{selectedUser.username}</div>
                </div>
              </div>
            </div>


            <div className="flex-1 overflow-y-auto px-4 py-3 bg-gradient-to-b from-gray-50 to-gray-100">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex mb-2 ${msg.self ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl shadow ${
                        msg.self
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <div>{msg.message}</div>
                      <div className="text-[10px] text-gray-300 mt-1 text-right">
                        {new Date(msg.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSend}
              className="p-3 border-t bg-white flex items-center gap-2"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
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
          <div className="flex flex-1 flex-col items-center justify-center text-gray-400 gap-3">
            <MessageSquare className="w-12 h-12 text-gray-300" />
            <p className="text-sm">Select a contact to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
