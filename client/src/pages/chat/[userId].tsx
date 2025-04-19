import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import Chat so it works on client-side only
const Chat = dynamic(() => import("@/components/Chat"), { ssr: false });

const ChatPage = () => {
  const router = useRouter();
  const { userId } = router.query;

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) {
      setCurrentUserId(storedId);
      console.log("✅ Loaded currentUserId from localStorage:", storedId);
    }
  }, []);

  if (!userId || typeof userId !== "string" || !currentUserId) {
    return <p className="text-white p-6">Loading chat...</p>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Private Chat</h1>
      <Chat currentUserId={currentUserId} selectedUserId={userId} />
    </div>
  );
};

export default ChatPage;
