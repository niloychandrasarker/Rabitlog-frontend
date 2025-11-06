import PostListItem from "./PostListItem";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams, Link } from "react-router-dom";

const fetchPosts = async (pageParam, searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);

  console.log(searchParamsObj);

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { page: pageParam, limit: 10, ...searchParamsObj },
  });
  return res.data;
};

const PostList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, searchParams),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
  });

  // if (status === "loading") return "Loading...";
  if (isFetching && !isFetchingNextPage) {
    return (
      <div className="flex flex-col gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md p-6 animate-pulse"
          >
            <div className="flex gap-6">
              <div className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="flex gap-4 mt-4">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // if (status === "error") return "Something went wrong!";
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⚠️</span>
          <div>
            <h3 className="text-lg font-bold text-red-800">
              Oops! Something went wrong
            </h3>
            <p className="text-red-600 mt-1">
              Unable to load posts. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  if (allPosts.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-md p-12 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          No Posts Found
        </h3>
        <p className="text-gray-600 mb-6">
          Be the first one to share your thoughts!
        </p>
        <Link
          to="/write"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <span>✍️</span>
          Write a Post
        </Link>
      </div>
    );
  }

  return (
    <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center gap-3 px-6 py-3 bg-blue-50 rounded-lg">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
            <span className="text-blue-600 font-medium">
              Loading more posts...
            </span>
          </div>
        </div>
      }
      endMessage={
        <div className="text-center py-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mt-6">
          <span className="text-4xl mb-3 block">🎉</span>
          <p className="text-lg font-semibold text-gray-800">
            You&apos;ve reached the end!
          </p>
          <p className="text-gray-600 mt-1">
            That&apos;s all the posts for now. Check back later for more.
          </p>
        </div>
      }
    >
      <div className="space-y-6">
        {allPosts.map((post) => (
          <PostListItem key={post._id} post={post} />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default PostList;
