import { useEffect, useState } from "react";

interface Post {
  _id: string;
  name: string;
  role: string;
  content: string;
  imageUrl?: string;
  timestamp: string;
  comments?: { text: string; author: string; createdAt: string }[];
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("userName");
    setToken(storedToken);
    setCurrentUser(storedUser);
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch(`${BACKEND_URL}/api/posts`);
    const data = await res.json();
    setPosts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const formData = new FormData();
    formData.append("content", newPost);
    if (image) formData.append("image", image);

    try {
      const res = await fetch(`${BACKEND_URL}/api/posts`, {
        method: "POST",
        headers: {
          Authorization: token || "",
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setPosts([data, ...posts]);
        setNewPost("");
        setImage(null);
      } else {
        alert("❌ Failed to post");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (postId: string, commentText: string) => {
    if (!commentText.trim()) return;

    try {
      await fetch(`${BACKEND_URL}/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: commentText,
          author: currentUser || "Guest",
        }),
      });

      fetchPosts();
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  return (
    <div className="max-w-2xl mx-auto">
      {token && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-3">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Write your update here..."
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          ></textarea>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="text-white"
          />

          <button
            type="submit"
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Post
          </button>
        </form>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="p-4 border border-gray-700 rounded bg-gray-800"
          >
            <div className="flex justify-between items-center mb-2 text-sm text-gray-400">
              <span>
                {post.name} ({post.role})
              </span>
              <span>{new Date(post.timestamp).toLocaleString()}</span>
            </div>

            <p className="text-white mb-2">{post.content}</p>

            {post.imageUrl && (
              <img
                src={`${BACKEND_URL}${post.imageUrl}`}
                alt="Post image"
                className="rounded max-w-full border mb-3"
              />
            )}

            {/* Comments Section */}
            <div className="space-y-2 mt-3">
              {post.comments?.map((comment, idx) => (
                <div key={idx} className="text-sm text-gray-300 space-y-1">
                  💬 <strong>{comment.author}</strong>: {comment.text}
                </div>
              ))}
            </div>

            {/* Comment Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleComment(post._id, commentInputs[post._id] || "");
                setCommentInputs((prev) => ({ ...prev, [post._id]: "" }));
              }}
              className="mt-3"
            >
              <input
                name="comment"
                placeholder="Write a comment..."
                value={commentInputs[post._id] || ""}
                onChange={(e) =>
                  setCommentInputs((prev) => ({
                    ...prev,
                    [post._id]: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              />
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
