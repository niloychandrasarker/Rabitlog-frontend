import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import PostListItem from "../componenet/PostListItem";

const fetchPopularPosts = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { sort: "popular" },
  });
  return res.data;
};

const PopularPage = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["popularPosts"],
    queryFn: fetchPopularPosts,
  });

  if (isPending) {
    return (
      <div className="mt-4">
        <div className="flex gap-4 mb-8">
          <Link to="/">Home</Link>
          <span>•</span>
          <span className="text-blue-800">Most Popular</span>
        </div>
        <div className="text-center py-20">Loading popular posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4">
        <div className="flex gap-4 mb-8">
          <Link to="/">Home</Link>
          <span>•</span>
          <span className="text-blue-800">Most Popular</span>
        </div>
        <div className="text-center py-20 text-red-500">
          Failed to load popular posts. Please try again.
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
        <span className="text-blue-800">Most Popular</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3 mb-2">
          <span className="text-5xl">⭐</span>
          Most Popular Posts
        </h1>
        <p className="text-gray-600 text-lg">
          All-time favorite articles loved by our readers
        </p>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No popular posts found.
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post, index) => (
            <div key={post._id} className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {index + 1}
              </div>
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

export default PopularPage;
