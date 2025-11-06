import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

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
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6 border border-blue-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="text-3xl animate-bounce">⭐</span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Most Popular
            </span>
          </h2>
          <div className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
            TOP
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse flex gap-3 p-3 bg-white rounded-lg"
            >
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  const posts = data?.posts || [];

  if (posts.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6 border border-blue-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="text-3xl">⭐</span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Most Popular
            </span>
          </h2>
          <div className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
            TOP
          </div>
        </div>
        <div className="text-center py-8 bg-white rounded-lg">
          <span className="text-5xl mb-3 block">🌟</span>
          <p className="text-gray-500 text-sm">No popular posts yet.</p>
          <p className="text-gray-400 text-xs mt-1">Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 md:p-6 border border-blue-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 md:gap-3">
          <span className="text-2xl md:text-3xl">⭐</span>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Most Popular
          </span>
        </h2>
        <div className="px-2 md:px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-md">
          TOP
        </div>
      </div>

      {/* Divider */}
      <div className="h-0.5 md:h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full mb-4 md:mb-6" />

      {/* Posts List */}
      <div className="space-y-2 md:space-y-3">
        {posts.map((post, index) => (
          <Link
            key={post._id}
            to={`/${post.slug}`}
            className="flex gap-3 md:gap-4 group p-2 md:p-3 rounded-lg md:rounded-xl transition-all duration-300 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-white hover:shadow-md border border-transparent hover:border-blue-200"
          >
            {/* Image or Placeholder */}
            <div className="relative flex-shrink-0">
              {post.img ? (
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg md:rounded-xl shadow-sm group-hover:shadow-md transition-shadow"
                />
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-200 to-purple-200 rounded-lg md:rounded-xl flex items-center justify-center">
                  <span className="text-xl md:text-2xl">📄</span>
                </div>
              )}
              {/* Rank Badge on Image */}
              {index < 3 && (
                <div className="absolute -top-1 -left-1 md:-top-2 md:-left-2 w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                  {index + 1}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xs md:text-sm line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug mb-1 md:mb-2">
                {post.title}
              </h3>
              <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-gray-500 flex-wrap">
                <span className="flex items-center gap-1 truncate max-w-[80px] sm:max-w-none">
                  <svg
                    className="w-3 h-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  <span className="truncate">{post.user?.username}</span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1 text-blue-600 font-semibold whitespace-nowrap">
                  <svg
                    className="w-3 h-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {post.visit || 0}
                </span>
              </div>
            </div>

            {/* Arrow Icon */}
            <div className="flex-shrink-0 self-center">
              <svg
                className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Button */}
      <Link
        to="/popular"
        className="mt-4 md:mt-6 flex items-center justify-center gap-2 w-full py-2.5 md:py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold text-sm md:text-base rounded-lg md:rounded-xl transition-all duration-300 shadow-md hover:shadow-lg group"
      >
        <span>View All Popular</span>
        <svg
          className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </Link>
    </div>
  );
};

export default PopularPosts;
