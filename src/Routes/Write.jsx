import { useAuth, useUser } from "@clerk/clerk-react";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../componenet/Upload";
const Write = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [cover, setCover] = useState(null);
  const [img, setImg] = useState("");
  const [video, setVideo] = useState("");
  const [value, setValue] = useState("");
  const [progress, setProgress] = useState(0);
  const [formErrors, setFormErrors] = useState({ title: "", content: "" });
  const quillRef = useRef(null);

  useEffect(() => {
    if (img && img.url) {
      const editor = quillRef.current?.getEditor?.();
      if (editor) {
        const range = editor.getSelection(true);
        const index = range ? range.index : editor.getLength();
        editor.insertEmbed(index, "image", img.url, "user");
        editor.insertText(index + 1, "\n");
        editor.setSelection(index + 2);
      }
      setImg("");
    }
  }, [img]);

  useEffect(() => {
    if (video && video.url) {
      const editor = quillRef.current?.getEditor?.();
      if (editor) {
        const range = editor.getSelection(true);
        const index = range ? range.index : editor.getLength();
        editor.insertEmbed(index, "video", video.url, "user");
        editor.insertText(index + 1, "\n");
        editor.setSelection(index + 2);
      }
      setVideo("");
    }
  }, [video]);

  const { getToken } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      // getToken is async — await the JWT before sending request
      const token = await getToken();
      return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (res) => {
      toast.success("Post has been created");
      navigate(`/${res.data.slug}`);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Failed to create post";
      toast.error(message);
    },
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (isLoaded && !isSignedIn) {
    return <div>You should login!</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const title = formData.get("title")?.trim() || "";
    const category = formData.get("category")?.trim() || "general";
    const desc = formData.get("desc")?.trim() || "";

    const textOnlyContent = value
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();

    const nextErrors = { title: "", content: "" };

    if (!title) {
      nextErrors.title = "Title is required";
    }

    if (!textOnlyContent) {
      nextErrors.content = "Content is required";
    }

    if (nextErrors.title || nextErrors.content) {
      setFormErrors(nextErrors);
      return;
    }

    if (formErrors.title || formErrors.content) {
      setFormErrors({ title: "", content: "" });
    }

    const data = {
      img: cover?.url || "",
      title,
      category,
      desc,
      content: value,
    };

    console.log(data);

    mutation.mutate(data);
  };

  return (
    <div className="h-[h-calc(100vh-64px)] md:h-[h-calc(100vh-80px)] flex flex-col gap-6">
      <h1 className="text-cl font-light">Create a new post</h1>
      <form
        onSubmit={handleSubmit}
        className=" flex flex-col gap-6 flex-1 mb-6 "
      >
        <Upload type="image" setProgress={setProgress} setData={setCover}>
          <button className="w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white">
            Add a cover image
          </button>
        </Upload>
        {cover?.url && (
          <img
            src={cover.url}
            alt="Cover preview"
            className="h-48 w-full object-cover rounded-xl shadow-md"
          />
        )}
        <input
          className="text-4xl font-semibold bg-transparent outline-none"
          type="text"
          placeholder="My Awesome Story"
          name="title"
        />
        {formErrors.title && (
          <p className="text-sm text-red-500">{formErrors.title}</p>
        )}
        <div className="flex items-center gap-4">
          <label htmlFor="content" className="text-sm">
            Choose a Category
          </label>
          <select
            name="category"
            id=""
            className="p-2 rounded-xl bg-white shadow-md"
          >
            <option value="general">General</option>
            <option value="web-design">Web Design</option>
            <option value="development">Development</option>
            <option value="databases">Databases</option>
            <option value="seo">SEO</option>
            <option value="marketing">Marketing</option>
            <option value="ai-ml">AI & ML</option>
            <option value="mobile">Mobile Apps</option>
            <option value="cloud">Cloud</option>
            <option value="devops">DevOps</option>
            <option value="security">Security</option>
            <option value="blockchain">Blockchain</option>
            <option value="research">Research</option>
          </select>
        </div>
        <textarea
          className="p-4 rounded-xl bg-white shadow-md"
          name="desc"
          placeholder="A Short Description"
        />
        <div className="flex flex-1">
          <div className="flex flex-col gap-2 mr-2">
            <Upload type="image" setProgress={setProgress} setData={setImg}>
              🌆
            </Upload>
            <Upload type="video" setProgress={setProgress} setData={setVideo}>
              ▶️
            </Upload>
          </div>
          <ReactQuill
            value={value}
            onChange={setValue}
            theme="snow"
            className="flex-1 rounded-xl bg-white shadow-md"
            ref={quillRef}
          />
        </div>
        {formErrors.content && (
          <p className="text-sm text-red-500">{formErrors.content}</p>
        )}
        <button
          disabled={mutation.isPending || (0 < progress && progress < 100)}
          className="bg-blue-800 text-white font-medium rounded-xl mt-4 p-2 w-36 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Loading..." : "Publish"}
        </button>
        {"Progress:" + progress}
        {mutation.isError && <span>{mutation.error.message}</span>}
      </form>
    </div>
  );
};

export default Write;
