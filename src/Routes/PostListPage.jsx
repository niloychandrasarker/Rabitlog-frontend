import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PostList from "../componenet/PostList";
import SideMenu from "../componenet/SideMenu";

const PostListPage = () => {
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();

  // Get category from URL params
  const category = searchParams.get("cat") || "";

  // Create a readable title based on category
  const getCategoryTitle = () => {
    if (!category) return "All Posts";

    // Convert kebab-case to Title Case
    return (
      category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ") + " Blog"
    );
  };

  return (
    <div className="">
      <h1 className="mb-8 text-2xl">{getCategoryTitle()}</h1>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-blue-800 text-sm text-white px-4 py-2 rounded-2xl mb-4 md:hidden"
      >
        {open ? "Close" : "Filter or Search"}
      </button>
      <div className="flex flex-col-reverse gap-8 md:flex-row">
        <div className="">
          <PostList />
        </div>
        <div className={`${open ? "block" : "hidden"} md:block`}>
          <SideMenu />
        </div>
      </div>
    </div>
  );
};

export default PostListPage;
