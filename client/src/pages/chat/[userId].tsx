import { useRouter } from "next/router";
import Chat from "../../components/Chat";

const ChatPage = () => {
  const router = useRouter();
  const { userId } = router.query;

  const currentUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  if (!currentUserId || !userId) return <p className="text-white p-4">Loading chat...</p>;

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <Chat currentUserId={currentUserId} selectedUserId={userId} />
    </div>
  );
};

export default ChatPage;
