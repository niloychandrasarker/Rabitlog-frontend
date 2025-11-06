import { Link, useParams } from "react-router-dom";
import Image from "../componenet/Image";
import Search from "../componenet/Search";
import PostMenuAction from "../componenet/PostMenuAction";
import Comments from "../componenet/Comments";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format as timeAgo } from "timeago.js";

const fetchPost = async (slug) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
  return res.data;
};

const SinglePostPage = () => {
  const { slug } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug),
  });

  if (isPending) return "loading...";
  if (error) return "Something went wrong!" + error.message;
  if (!data) return "Post not found!";

  const contentHtml = data.content || "";

  return (
    <div className="flex flex-col gap-8 mt-2">
      {/* Details */}
      <div className="flex gap-8">
        <div className="lg:w-3/5 flex flex-col gap-8">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">
            {data.title}
          </h1>

          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Written By</span>
            <Link to="" className="text-blue-800">
              {data.user?.username}
            </Link>
            <span className="">on</span>
            <Link to="" className="text-blue-800">
              {data.category}
            </Link>
            <span className="">
              {data.createdAt ? timeAgo(data.createdAt) : ""}
            </span>
          </div>
          <p className="text-gray-500 font-medium">{data.desc}</p>
        </div>
        {data.img && (
          <div className="hidden lg:block w-2/5">
            <Image
              src={data.img}
              w="500"
              className="rounded-2xl object-cover max-h-72"
            />
          </div>
        )}
      </div>
      {/* content */}
      <div className="flex flex-col md:flex-row gap-12 justify-between">
        {/* text */}
        <div className="flex-1  rounded-xl ">
          <div
            className="ql-editor"
            style={{ border: "none", padding: "0" }}
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
        {/* menu */}
        <div className="px-4 h-max sticky top-8">
          <h1 className="mb-4 text-sm font-medium">Author</h1>
          <div className="flex flex-col gap-4 ">
            <div className="flex items-center gap-8">
              {data.user?.img && (
                <Image
                  src={data.user?.img}
                  className="w-12 h-12 rounded-full object-cover"
                  w="48"
                  h="48"
                />
              )}
              <Link className="text-blue-800">{data.user?.username}</Link>
            </div>
            <p className="text-sm text-gray-500">
              Lorem ipsum dolor sit amet consectetur
            </p>
            <div className="flex gap-2">
              <Link>
                <Image src="facebook.svg" />
              </Link>
              <Link>
                <Image src="instagram.svg" />
              </Link>
            </div>
          </div>

          <PostMenuAction post={data} />
          <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/" className="underline">
              All
            </Link>
            <Link className="underline" to="/">
              Web Design
            </Link>
            <Link className="underline" to="/">
              Development
            </Link>
            <Link className="underline" to="/">
              Databases
            </Link>
            <Link className="underline" to="/">
              Search Engines
            </Link>
            <Link className="underline" to="/">
              Marketing
            </Link>
          </div>
          <h1 className="mt-8 mb-4 text-sm font-medium">Search</h1>
          <Search />
        </div>
      </div>
      <Comments postId={data._id} />
    </div>
  );
};

export default SinglePostPage;
