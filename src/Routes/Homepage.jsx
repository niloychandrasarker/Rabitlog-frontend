import { Link } from "react-router-dom";
import MainCategories from "../componenet/MainCategories";
import FeaturedPosts from "../componenet/FeaturedPosts";
import PostList from "../componenet/PostList";
import TrendingPosts from "../componenet/TrendingPosts";
import PopularPosts from "../componenet/PopularPosts";

const Homepage = () => {
  return (
    <div className="mt-4 flex flex-col gap-6 md:gap-8">
      {/* BreadCrumb */}
      <div className="flex gap-2 text-sm md:text-base">
        <Link
          to="/"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          Home
        </Link>
        <span className="text-gray-400">•</span>
        <span className="text-blue-800 font-medium">Blogs and Articles</span>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
        {/* Titles */}
        <div className="flex-1">
          <h1 className="text-gray-800 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
            Discover, discuss, and redefine technology{" "}
            <span className="hidden md:inline">
              <br />
            </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              — one blog at a time
            </span>
          </h1>
          <p className="mt-4 md:mt-8 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
            Discover amazing articles, share your ideas, and connect with
            writers from around the globe. Your voice matters here.
          </p>

          {/* Mobile CTA Button */}
          <Link
            to="/write"
            className="md:hidden inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Write Your Story
          </Link>
        </div>

        {/* Animated Button - Desktop Only */}
        <Link to="/write" className="hidden md:block relative flex-shrink-0">
          <svg
            viewBox="0 0 200 200"
            width="200"
            height="200"
            className="text-lg tracking-widest animate-spin animateButton"
          >
            <path
              id="circlePath"
              fill="none"
              d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
            />
            <text>
              <textPath href="#circlePath" startOffset="0%">
                Write your story •
              </textPath>
              <textPath href="#circlePath" startOffset="50%">
                Share your idea •
              </textPath>
            </text>
          </svg>
          <button className="absolute top-0 left-0 right-0 bottom-0 m-auto w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="50"
              height="50"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <line x1="6" y1="18" x2="18" y2="6" />
              <polyline points="9 6 18 6 18 15" />
            </svg>
          </button>
        </Link>
      </div>

      {/* CATEGORIES */}
      <MainCategories />

      {/* Feature Post */}
      <FeaturedPosts />

      {/* TRENDING & POPULAR SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-8">
        <TrendingPosts />
        <PopularPosts />
      </div>

      {/* RECENT POSTS - FULL WIDTH */}
      <div className="mb-8">
        {/* Section Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 md:gap-3">
                <span className="text-3xl md:text-4xl">📰</span>
                <span>Recent Posts</span>
              </h2>
              <p className="text-sm md:text-base text-gray-600 mt-2">
                Stay updated with the latest articles and insights
              </p>
            </div>
            <Link
              to="/posts"
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm md:text-base whitespace-nowrap"
            >
              View All
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          {/* Divider */}
          <div className="mt-4 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
        </div>

        {/* Posts Grid */}
        <PostList />
      </div>
    </div>
  );
};

export default Homepage;
