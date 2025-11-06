import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";

const PostListItem = ({ post }) => {
  return (
    <article className="group flex flex-col xl:flex-row gap-0 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200">
      {/* image */}
      {post.img && (
        <Link
          to={`/${post.slug}`}
          className="xl:w-2/5 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-10" />
          <Image
            src={post.img}
            className="w-full h-64 xl:h-full object-cover group-hover:scale-105 transition-transform duration-700"
            w="500"
          />
          {/* Category Badge */}
          <div className="absolute top-4 left-4 z-20">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
              <span>📁</span>
              {post.category}
            </span>
          </div>
        </Link>
      )}
      {/* details */}
      <div className="flex flex-col gap-4 xl:w-3/5 p-8">
        {/* Author Info & Date */}
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
              {post.user?.username?.charAt(0).toUpperCase()}
            </div>
            <Link
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              to={`/posts?author=${post.user?.username}`}
            >
              {post.user?.username}
            </Link>
          </div>
          <span className="text-gray-400">•</span>
          <span className="text-gray-500 flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {format(post.createdAt)}
          </span>
        </div>

        {/* Title */}
        <Link
          to={`/${post.slug}`}
          className="text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight"
        >
          {post.title}
        </Link>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed line-clamp-3 text-base">
          {post.desc}
        </p>

        {/* Footer with Stats & CTA */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {post.visit || 0}
            </span>
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              0
            </span>
          </div>

          {/* Read More Button */}
          <Link
            to={`/${post.slug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold text-sm group/btn transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Read Article
            <svg
              className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
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
      </div>
    </article>
  );
};

export default PostListItem;
