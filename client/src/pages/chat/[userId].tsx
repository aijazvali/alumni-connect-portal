import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Chat = dynamic(() => import("@/components/Chat"), { ssr: false });

const ChatPage = () => {
  const router = useRouter();
  const { userId } = router.query;

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) setCurrentUserId(storedId);
  }, []);

  if (!userId || typeof userId !== "string" || !currentUserId) {
    return <div className="text-white p-5">Loading chat...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Private Chat</h1>
      <Chat currentUserId={currentUserId} selectedUserId={userId} />
    </div>
  );
};

export default ChatPage;
