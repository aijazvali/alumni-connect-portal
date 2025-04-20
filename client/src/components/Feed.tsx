import { useEffect, useState } from "react";
import axios from "axios";

interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  role: string;
  imageUrl?: string;
  comments?: string[];
}

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("https://alumni-connect-portal.onrender.com/api/posts");
        setPosts(res.data.reverse());
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <h2 className="text-2xl font-bold mb-6 text-white text-center">📢 Recent Posts</h2>
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post._id} className="bg-gray-800 rounded-lg p-4 shadow-md text-white">
            <div className="mb-2">
              <span className="font-semibold">{post.author}</span>
              <span className="text-sm text-gray-400 ml-2">({post.role})</span>
            </div>

            <h3 className="text-lg font-bold mb-1">{post.title}</h3>
            <p className="text-sm mb-3">{post.content}</p>

            {post.imageUrl && (
              <img
                src={`https://alumni-connect-portal.onrender.com${post.imageUrl}`}
                alt="Post visual"
                className="rounded max-w-full h-auto mb-3"
              />
            )}

            {post.comments && post.comments.length > 0 && (
              <div className="bg-gray-700 p-2 rounded mt-3">
                <p className="text-sm font-semibold mb-1">💬 Comments:</p>
                {post.comments.map((comment, index) => (
                  <p key={index} className="text-sm text-gray-300">• {comment}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
