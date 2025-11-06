import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "timeago.js";

const fetchTrendingPosts = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { sort: "trending", limit: 5 },
  });
  return res.data;
};

const TrendingPosts = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["trendingPosts"],
    queryFn: fetchTrendingPosts,
  });

  if (isPending) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          Trending Now
        </h2>
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  const posts = data?.posts || [];

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          Trending Now
        </h2>
        <div className="text-gray-500 text-sm text-center py-4">
          No trending posts yet. Check back soon!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="text-2xl">🔥</span>
        Trending Now
      </h2>
      <div className="space-y-4">
        {posts.map((post, index) => (
          <Link
            key={post._id}
            to={`/${post.slug}`}
            className="flex gap-3 group hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <span>{post.user?.username}</span>
                <span>•</span>
                <span>{format(post.createdAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Link
        to="/trending"
        className="mt-4 block text-center text-orange-600 hover:text-orange-700 font-semibold text-sm"
      >
        View All Trending →
      </Link>
    </div>
  );
};

export default TrendingPosts;
