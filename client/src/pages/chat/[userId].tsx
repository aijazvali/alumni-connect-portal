// src/pages/chat/[userId].tsx

import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/authcontext/AuthContext";
import Chat from "@/components/Chat";

const ChatPage = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { user } = useContext(AuthContext);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (user && user._id && userId) {
      setShowChat(true);
    }
  }, [user, userId]);

  if (!user || !user._id) {
    return <div className="text-white p-5">Loading user info...</div>;
  }

  if (!userId || typeof userId !== "string") {
    return <div className="text-red-500 p-5">Invalid user ID.</div>;
  }

  if (!showChat) {
    return <div className="text-white p-5">Loading chat...</div>;
  }

  return (
    <Chat currentUserId={user._id} selectedUserId={userId} />
  );
};

export default ChatPage;
