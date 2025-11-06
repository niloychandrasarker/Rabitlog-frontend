import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "timeago.js";

const fetchPopularPosts = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { sort: "popular", limit: 5 },
  });
  return res.data;
};

const PopularPosts = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["popularPosts"],
    queryFn: fetchPopularPosts,
  });

  if (isPending) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          Most Popular
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
          <span className="text-2xl">⭐</span>
          Most Popular
        </h2>
        <div className="text-gray-500 text-sm text-center py-4">
          No popular posts yet. Check back soon!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="text-2xl">⭐</span>
        Most Popular
      </h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <Link key={post._id} to={`/${post.slug}`} className="block group">
            <div className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              {post.img && (
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
              )}
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
            </div>
          </Link>
        ))}
      </div>
      <Link
        to="/popular"
        className="mt-4 block text-center text-blue-600 hover:text-blue-700 font-semibold text-sm"
      >
        View All Popular →
      </Link>
    </div>
  );
};

export default PopularPosts;
