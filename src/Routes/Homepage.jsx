import { Link } from "react-router-dom";
import MainCategories from "../componenet/MainCategories";
import FeaturedPosts from "../componenet/FeaturedPosts";
import PostList from "../componenet/PostList";
import TrendingPosts from "../componenet/TrendingPosts";
import PopularPosts from "../componenet/PopularPosts";

const Homepage = () => {
  return (
    <div className="mt-4 flex flex-col gap-4">
      {/* BreadCrumb */}
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <span>•</span>
        <span className="text-blue-800">Blogs and Articles</span>
      </div>
      {/* Introduction */}
      <div className="flex items-center justify-between">
        {/* titles */}
        <div className="">
          <h1 className="text-gray-800 text-2xl md:text-5xl lg:text-6xl font-bold">
            Discover, discuss, and redefine technology <br /> — one blog at a
            time
          </h1>
          <p className="mt-8 text-md md:text-xl">
            Discover amazing articles, share your ideas, and connect with
            writers from around the globe. Your voice matters here.
          </p>
        </div>
        {/* animated button */}
        <Link to="write" className="hidden md:block relative">
          <svg
            viewBox="0 0 200 200"
            width="200"
            height="200"
            // className="text-lg tracking-widest "
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
          <button className="absolute top-0 left-0 right-0 bottom-0 m-auto w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TrendingPosts />
        <PopularPosts />
      </div>

      {/* RECENT POSTS - FULL WIDTH */}
      <div className="mb-8">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-4xl">📰</span>
                Recent Posts
              </h2>
              <p className="text-gray-600 mt-2">
                Stay updated with the latest articles and insights
              </p>
            </div>
            <Link
              to="/posts"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
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
