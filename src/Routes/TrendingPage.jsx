import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import PostListItem from "../componenet/PostListItem";

const fetchTrendingPosts = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { sort: "trending" },
  });
  return res.data;
};

const TrendingPage = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["trendingPosts"],
    queryFn: fetchTrendingPosts,
  });

  if (isPending) {
    return (
      <div className="mt-4">
        <div className="flex gap-4 mb-8">
          <Link to="/">Home</Link>
          <span>•</span>
          <span className="text-blue-800">Trending Posts</span>
        </div>
        <div className="text-center py-20">Loading trending posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4">
        <div className="flex gap-4 mb-8">
          <Link to="/">Home</Link>
          <span>•</span>
          <span className="text-blue-800">Trending Posts</span>
        </div>
        <div className="text-center py-20 text-red-500">
          Failed to load trending posts. Please try again.
        </div>
      </div>
    );
  }

  const posts = data?.posts || [];

  return (
    <div className="mt-4">
      {/* BreadCrumb */}
      <div className="flex gap-4 mb-8">
        <Link to="/">Home</Link>
        <span>•</span>
        <span className="text-blue-800">Trending Posts</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center gap-3 mb-2">
          <span className="text-4xl sm:text-5xl">🔥</span>
          Trending Posts
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Most popular articles from the last 7 days
        </p>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No trending posts found.
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {posts.map((post, index) => (
            <div key={post._id} className="flex gap-3 sm:gap-4 items-start">
              {/* Ranking Badge - Hidden on Mobile */}
              <div className="hidden sm:flex flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-600 items-center justify-center text-white font-bold text-xl shadow-lg">
                {index + 1}
              </div>
              {/* Post Card */}
              <div className="flex-1">
                <PostListItem post={post} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingPage;
