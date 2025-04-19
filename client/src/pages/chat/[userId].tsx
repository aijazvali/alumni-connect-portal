import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Chat = dynamic(() => import("@/components/Chat"), { ssr: false });

const ChatPage = () => {
  const router = useRouter();
  const { userId } = router.query;
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("userId");
      if (id) setCurrentUserId(id);
    }
  }, []);

  if (!userId || !currentUserId || typeof userId !== "string") return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Private Chat</h1>
      <Chat currentUserId={currentUserId} selectedUserId={userId} />
    </div>
  );
};

export default ChatPage;
