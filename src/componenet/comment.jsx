import { useAuth, useUser } from "@clerk/clerk-react";
import Image from "./Image";
import { format as timeAgo } from "timeago.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";

const Comment = ({ comment, postId }) => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const role = user?.publicMetadata?.role;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.delete(
        `${import.meta.env.VITE_API_URL}/comments/${comment._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  return (
    <div className="p-4 bg-slate-50 rounded-xl mb-8">
      <div className="flex items-center gap-4">
        {comment.user?.img && (
          <Image
            src={comment.user?.img}
            className="w-10 h-10 rounded-full"
            w="40"
          />
        )}
        <span className="text-blue-800 font-semibold">
          {comment.user?.username}
        </span>
        <span className="text-sm text-gray-500">
          {comment.createdAt ? timeAgo(comment.createdAt) : ""}
        </span>
        {user &&
          (comment.user.username === user.username || role === "admin") && (
            <span
              className="text-xs text-red-300 hover:text-red-500 cursor-pointer"
              onClick={() => mutation.mutate()}
            >
              delete
              {mutation.isPending && <span>(in progress)</span>}
            </span>
          )}
      </div>
      <div>
        <p className="mt-2">{comment.desc}</p>
      </div>
    </div>
  );
};

export default Comment;
