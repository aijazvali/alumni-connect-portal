// src/pages/chat/[userId].tsx

import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/authcontext/AuthContext";
import dynamic from "next/dynamic";

const Chat = dynamic(() => import("@/components/Chat"), { ssr: false });

const ChatPage = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { user } = useContext(AuthContext);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (user?.id || user?._id) {
      setReady(true);
    }
  }, [user]);

  if (!router.isReady || !ready) {
    return <div className="text-white p-5">Loading chat...</div>;
  }

  const currentUserId = user?._id || user?.id;
  const selectedUserId = typeof userId === "string" ? userId : "";

  if (!currentUserId || !selectedUserId) {
    return <div className="text-red-500 p-5">User data not loaded properly.</div>;
  }

  return (
    <div className="p-5 text-white">
      <Chat currentUserId={currentUserId} selectedUserId={selectedUserId} />
    </div>
  );
};

export default ChatPage;
