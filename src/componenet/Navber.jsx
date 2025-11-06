import { useState, useEffect } from "react";
import Image from "./Image";
import { Link, useLocation } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  useAuth,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Navber = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user } = useUser();

  const { getToken } = useAuth();

  // Fetch user's posts stats
  const { data: userStats } = useQuery({
    queryKey: ["userStats", user?.username],
    queryFn: async () => {
      if (!user?.username) return null;

      const postsRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/user/${user.username}`
      );

      const posts = postsRes.data || [];
      const totalViews = posts.reduce(
        (sum, post) => sum + (post.visit || 0),
        0
      );

      return {
        postCount: posts.length,
        totalViews: totalViews,
      };
    },
    enabled: !!user?.username,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  useEffect(() => {
    getToken().then((token) => {
      console.log("Clerk Token:", token);
    });
  }, [getToken]);

  // Close mobile menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const navLinks = [
    { to: "/", label: "Home", icon: "🏠", desc: "Homepage" },
    { to: "/trending", label: "Trending", icon: "🔥", desc: "Hot topics" },
    { to: "/popular", label: "Popular", icon: "⭐", desc: "Most viewed" },
    { to: "/about", label: "About", icon: "ℹ️", desc: "About us" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="w-full h-16 md:h-20 flex items-center justify-between relative z-50 backdrop-blur-md border-b border-gray-100">
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 text-xl md:text-2xl font-bold hover:opacity-80 transition-all duration-300 group"
      >
        <div className="relative">
          <Image
            src="rabit2.png"
            alt="Logo"
            w={36}
            h={36}
            className="group-hover:scale-110 transition-transform"
          />
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity" />
        </div>
        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-extrabold">
          Rabitlog
        </span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4 xl:gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`relative px-4 py-2 rounded-xl transition-all duration-300 group ${
              isActive(link.to)
                ? "text-blue-600 font-bold bg-blue-50"
                : "text-gray-700 hover:text-blue-600 hover:bg-blue-50/50"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-lg group-hover:scale-110 transition-transform">
                {link.icon}
              </span>
              <span>{link.label}</span>
            </span>
            {isActive(link.to) && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
            )}
          </Link>
        ))}

        <SignedIn>
          <Link
            to="/write"
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
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
            <span className="hidden lg:inline">Write</span>
          </Link>
        </SignedIn>

        <SignedOut>
          <Link to="/login">
            <button className="flex items-center gap-2 py-2 px-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:shadow-xl hover:scale-105 transition-all duration-300">
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
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Login
            </button>
          </Link>
        </SignedOut>

        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  "w-10 h-10 ring-2 ring-blue-200 hover:ring-blue-400 transition-all shadow-md",
                userButtonPopoverFooter: "hidden",
              },
            }}
          />
        </SignedIn>
      </div>

      {/* Mobile Menu Button - Only hamburger icon */}
      <div className="md:hidden">
        <button
          onClick={() => setOpen(!open)}
          className={`relative w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-300 ${
            open
              ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg scale-110"
              : "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-50 hover:to-purple-50 hover:scale-105"
          }`}
          aria-label="Toggle menu"
        >
          <div className="flex flex-col items-center justify-center w-6 h-6">
            <span
              className={`block h-0.5 w-6 transition-all duration-300 ${
                open ? "rotate-45 translate-y-1.5 bg-white" : "bg-gray-800"
              }`}
            />
            <span
              className={`block h-0.5 w-6 my-1 transition-all duration-300 ${
                open ? "opacity-0 bg-white" : "bg-gray-800"
              }`}
            />
            <span
              className={`block h-0.5 w-6 transition-all duration-300 ${
                open ? "-rotate-45 -translate-y-1.5 bg-white" : "bg-gray-800"
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu - Dropdown Style (No Overlay, No Drawer) */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-2xl transition-all duration-300 ease-out ${
          open
            ? "max-h-[calc(100vh-4rem)] opacity-100 overflow-y-auto"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col">
          {/* Menu Header */}
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Menu
                </h3>
                <p className="text-xs text-gray-600 mt-1">Explore & Create</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🚀</span>
              </div>
            </div>
          </div>

          {/* Menu Links */}
          <div className="px-4 py-6">
            {/* Main Navigation */}
            <div className="space-y-2 mb-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                    isActive(link.to)
                      ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg scale-105"
                      : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-blue-50 hover:to-purple-50 hover:scale-102 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isActive(link.to)
                        ? "bg-white/20"
                        : "bg-white group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100"
                    }`}
                  >
                    <span className="text-lg">{link.icon}</span>
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-sm block leading-tight">
                      {link.label}
                    </span>
                    <span
                      className={`text-xs ${
                        isActive(link.to) ? "text-white/80" : "text-gray-500"
                      }`}
                    >
                      {link.desc}
                    </span>
                  </div>
                  {isActive(link.to) && (
                    <svg
                      className="ml-auto w-5 h-5 animate-pulse"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </Link>
              ))}
            </div>

            {/* Create Post Section */}
            <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-200">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                <span>✨</span>
                Create Content
              </h4>
              <SignedIn>
                <Link
                  to="/write"
                  className="group flex items-center gap-4 px-5 py-4 rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  onClick={() => setOpen(false)}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="block text-base leading-tight">
                      Post Blog
                    </span>
                    <span className="text-xs text-white/80">
                      Write a new article
                    </span>
                  </div>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </SignedIn>
              <SignedOut>
                <Link
                  to="/login"
                  className="group flex items-center gap-4 px-5 py-4 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  onClick={() => setOpen(false)}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="block text-base leading-tight">
                      Login First
                    </span>
                    <span className="text-xs text-white/80">
                      To create posts
                    </span>
                  </div>
                </Link>
              </SignedOut>
            </div>

            {/* Quick Stats */}
            <SignedIn>
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
                <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                  Your Stats
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-lg font-bold text-blue-600">
                      {userStats?.postCount ?? (
                        <span className="text-base">...</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">Posts</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-lg font-bold text-purple-600">
                      {userStats?.totalViews ?? (
                        <span className="text-base">...</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">Views</div>
                  </div>
                </div>
              </div>
            </SignedIn>
          </div>

          {/* Menu Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <SignedOut>
              <Link to="/login" onClick={() => setOpen(false)}>
                <button className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
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
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Join Rabitlog</span>
                </button>
              </Link>
            </SignedOut>
            <SignedIn>
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                      userButtonPopoverFooter: "hidden",
                    },
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-800 truncate">
                    {user?.username || "User"}
                  </p>
                  <p className="text-xs text-gray-500">Active member</p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navber;
