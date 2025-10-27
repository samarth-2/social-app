import { useEffect } from "react";
import { socket } from "./socket";
import { toast } from "react-toastify";

export default function SocketEventHandler() {
  useEffect(() => {

    const stored = JSON.parse(localStorage.getItem("user"));
    if (!socket.connected) {
      socket.connect();
    }

    if (stored && stored._id) {
      socket.emit("register_user", stored._id);
    }

    socket.on("connect", () => {
      console.debug("socket connected", socket.id);
    });
    socket.on("connect_error", (err) => {
      console.warn("socket connect error", err);
    });

    socket.on("new_post_added", (data) => {
      toast.info(`${data.username} added a new post`);
    });

    socket.on("new_comment_added", (data) => {
      toast.info(`${data.username} added a comment on ${data.author}'s post`);
    });

    return () => {
      socket.off("new_post_added");
      socket.off("new_comment_added");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);

  return null;
}
