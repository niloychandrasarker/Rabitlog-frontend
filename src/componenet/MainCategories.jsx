import { Link } from "react-router-dom";
import Search from "./Search";
import { useRef } from "react";

const MainCategories = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      if (direction === "left") {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const categories = [
    { name: "All Posts", slug: "", icon: "🏠" },
    { name: "Web Design", slug: "web-design", icon: "🎨" },
    { name: "Development", slug: "development", icon: "💻" },
    { name: "Databases", slug: "databases", icon: "🗄️" },
    { name: "SEO", slug: "seo", icon: "🔍" },
    { name: "Marketing", slug: "marketing", icon: "📊" },
    { name: "AI & ML", slug: "ai-ml", icon: "🤖" },
    { name: "Mobile Apps", slug: "mobile", icon: "📱" },
    { name: "Cloud", slug: "cloud", icon: "☁️" },
    { name: "DevOps", slug: "devops", icon: "⚙️" },
    { name: "Security", slug: "security", icon: "🔒" },
    { name: "Blockchain", slug: "blockchain", icon: "⛓️" },
    { name: "Research", slug: "research", icon: "🔬" },
  ];

  return (
    <div className="w-full py-4">
      {/* Mobile: Horizontal Scroll */}
      <div className="md:hidden">
        <h3 className="text-lg font-semibold mb-3 px-4">Categories</h3>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 px-4 pb-2">
            {categories.map((cat, index) => (
              <Link
                key={index}
                to={cat.slug ? `/posts?cat=${cat.slug}` : "/posts"}
                className="flex-shrink-0 flex items-center gap-2 bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200"
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="font-medium whitespace-nowrap text-sm">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: Horizontal Scroll with Search Bar and Arrows */}
      <div className="hidden md:flex bg-white rounded-3xl xl:rounded-full shadow-lg p-4 items-center gap-4">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Scroll left"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Categories - Horizontal Scroll */}
        <div className="flex-1 overflow-x-auto scrollbar-hide" ref={scrollRef}>
          <div className="flex gap-3 min-w-max">
            {categories.map((cat, index) => (
              <Link
                key={index}
                to={cat.slug ? `/posts?cat=${cat.slug}` : "/posts"}
                className={`flex-shrink-0 flex items-center gap-2 rounded-full px-5 py-2.5 font-medium transition-all duration-300 ${
                  index === 0
                    ? "bg-blue-800 text-white shadow-md hover:shadow-lg"
                    : "hover:bg-blue-50 text-gray-700 hover:text-blue-600"
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="whitespace-nowrap">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Scroll right"
        >
          <svg
            className="w-5 h-5 text-gray-600"
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
        </button>

        {/* Divider */}
        <span className="text-xl font-medium text-gray-300">|</span>

        {/* Search */}
        <Search />
      </div>
    </div>
  );
};

export default MainCategories;
