import { useAuth, useUser } from "@clerk/clerk-react";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill, { Quill } from "react-quill-new";
import ImageResize from "quill-image-resize-module-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../componenet/Upload";
import ImageAlignmentButtons from "../componenet/ImageAlignmentButtons";

// Register image resize module
Quill.register("modules/imageResize", ImageResize);

const Write = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [searchParams] = useSearchParams();
  const editPostSlug = searchParams.get("edit");

  const [cover, setCover] = useState(null);
  const [img, setImg] = useState("");
  const [video, setVideo] = useState("");
  const [value, setValue] = useState("");
  const [progress, setProgress] = useState(0);
  const [formErrors, setFormErrors] = useState({ title: "", content: "" });
  const [showPreview, setShowPreview] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("general");
  const quillRef = useRef(null);

  // Fetch post data if editing
  const { data: existingPost } = useQuery({
    queryKey: ["post-edit", editPostSlug],
    queryFn: async () => {
      if (!editPostSlug) return null;
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/${editPostSlug}`
      );
      return res.data;
    },
    enabled: !!editPostSlug,
  });

  // Load existing post data into form
  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title || "");
      setDesc(existingPost.desc || "");
      setCategory(existingPost.category || "general");
      if (existingPost.img) {
        setCover({ url: existingPost.img });
      }

      // Set content with a small delay to ensure Quill is ready
      if (existingPost.content) {
        setTimeout(() => {
          setValue(existingPost.content);
        }, 100);
      }
    }
  }, [existingPost]);

  // Advanced Quill modules with more features
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ align: [] }],
        ["link", "image", "video"],
        ["clean"],
      ],
    },
    imageResize: {
      parchment: Quill.import("parchment"),
      modules: ["Resize", "DisplaySize", "Toolbar"],
      handleStyles: {
        backgroundColor: "#3b82f6",
        border: "2px solid white",
        width: "12px",
        height: "12px",
      },
      displayStyles: {
        backgroundColor: "#3b82f6",
        border: "1px solid white",
        color: "white",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
      },
    },
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "direction",
    "align",
    "link",
    "image",
    "video",
  ];

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
    mutationFn: async (postData) => {
      const token = await getToken();

      if (editPostSlug && existingPost) {
        // Update existing post
        return axios.put(
          `${import.meta.env.VITE_API_URL}/posts/${existingPost._id}`,
          postData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Create new post
        return axios.post(`${import.meta.env.VITE_API_URL}/posts`, postData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    },
    onSuccess: (res) => {
      toast.success(
        editPostSlug ? "Post has been updated" : "Post has been created"
      );
      navigate(`/${res.data.slug}`);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        `Failed to ${editPostSlug ? "update" : "create"} post`;
      toast.error(message);
    },
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (isLoaded && !isSignedIn) {
    return <div>You should login!</div>;
  }

  if (editPostSlug && !existingPost) {
    return <div>Loading post...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const textOnlyContent = value
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();

    const nextErrors = { title: "", content: "" };

    if (!trimmedTitle) {
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
      title: trimmedTitle,
      category,
      desc: desc.trim() || "",
      content: value,
    };

    console.log(data);

    mutation.mutate(data);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] pb-8">
      {/* Header with tabs */}
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">
          {showPreview
            ? "Preview Your Post"
            : editPostSlug
            ? "Edit Post"
            : "Create a New Post"}
        </h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              !showPreview
                ? "bg-blue-800 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            ✏️ Editor
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              showPreview
                ? "bg-blue-800 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            👁️ Preview
          </button>
        </div>
      </div>

      {/* Preview Mode */}
      {showPreview ? (
        <div className="max-w-4xl mx-auto">
          <article className="bg-white rounded-xl shadow-lg p-8">
            {cover?.url && (
              <img
                src={cover.url}
                alt="Cover"
                className="w-full h-96 object-cover rounded-xl mb-8"
              />
            )}
            <div className="mb-4">
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {category.replace("-", " ").toUpperCase()}
              </span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              {title || "Untitled Post"}
            </h1>
            {desc && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {desc}
              </p>
            )}
            <div className="border-t pt-8">
              <div
                className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-img:rounded-xl prose-img:shadow-md prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded"
                dangerouslySetInnerHTML={{
                  __html: value || "<p>Start writing your content...</p>",
                }}
              />
            </div>
          </article>
        </div>
      ) : (
        /* Editor Mode */
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Cover Image */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Cover Image
            </label>
            <Upload type="image" setProgress={setProgress} setData={setCover}>
              <button
                type="button"
                className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors text-gray-600 hover:text-blue-600"
              >
                📷 {cover?.url ? "Change Cover Image" : "Add Cover Image"}
              </button>
            </Upload>
            {cover?.url && (
              <div className="mt-4 relative">
                <img
                  src={cover.url}
                  alt="Cover preview"
                  className="h-64 w-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setCover(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Post Title *
            </label>
            <input
              className="w-full text-4xl font-bold bg-transparent outline-none border-b-2 border-gray-200 focus:border-blue-500 transition-colors pb-2"
              type="text"
              placeholder="Enter your awesome title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {formErrors.title && (
              <p className="text-sm text-red-500 mt-2">{formErrors.title}</p>
            )}
          </div>

          {/* Category & Description */}
          <div className="bg-white rounded-xl shadow-md p-6 grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 outline-none transition-colors"
              >
                <option value="general">📝 General</option>
                <option value="web-design">🎨 Web Design</option>
                <option value="development">💻 Development</option>
                <option value="databases">🗄️ Databases</option>
                <option value="seo">🔍 SEO</option>
                <option value="marketing">📢 Marketing</option>
                <option value="ai-ml">🤖 AI & ML</option>
                <option value="mobile">📱 Mobile Apps</option>
                <option value="cloud">☁️ Cloud</option>
                <option value="devops">⚙️ DevOps</option>
                <option value="security">🔒 Security</option>
                <option value="blockchain">⛓️ Blockchain</option>
                <option value="research">🔬 Research</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Word Count
              </label>
              <div className="p-3 rounded-lg bg-gray-50 border-2 border-gray-200">
                <span className="text-2xl font-bold text-blue-600">
                  {
                    value
                      .replace(/<[^>]*>/g, "")
                      .replace(/&nbsp;/g, " ")
                      .trim()
                      .split(/\s+/)
                      .filter(Boolean).length
                  }
                </span>
                <span className="text-gray-600 ml-2">words</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Short Description
            </label>
            <textarea
              className="w-full p-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 outline-none transition-colors resize-none"
              rows="3"
              placeholder="Write a brief description of your post..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-2">
              {desc.length}/200 characters
            </p>
          </div>

          {/* Rich Text Editor */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Content *
              </label>
              <div className="flex gap-3 items-center">
                <ImageAlignmentButtons quillRef={quillRef} />
                <div className="h-6 w-px bg-gray-300" />
                <Upload type="image" setProgress={setProgress} setData={setImg}>
                  <button
                    type="button"
                    className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    🌆 Image
                  </button>
                </Upload>
                <Upload
                  type="video"
                  setProgress={setProgress}
                  setData={setVideo}
                >
                  <button
                    type="button"
                    className="px-3 py-1 text-sm bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    ▶️ Video
                  </button>
                </Upload>
              </div>
            </div>
            <ReactQuill
              value={value}
              onChange={setValue}
              theme="snow"
              modules={modules}
              formats={formats}
              className="bg-white rounded-lg"
              style={{ height: "400px", marginBottom: "50px" }}
              ref={quillRef}
              placeholder="Start writing your amazing content here..."
            />
            {formErrors.content && (
              <p className="text-sm text-red-500 mt-2">{formErrors.content}</p>
            )}
          </div>

          {/* Progress Bar */}
          {progress > 0 && progress < 100 && (
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                if (confirm("Are you sure you want to discard this post?")) {
                  setTitle("");
                  setDesc("");
                  setValue("");
                  setCover(null);
                }
              }}
              className="px-6 py-3 rounded-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || (0 < progress && progress < 100)}
              className="px-8 py-3 rounded-lg font-medium text-white bg-blue-800 hover:bg-blue-900 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <span className="animate-spin">⏳</span>{" "}
                  {editPostSlug ? "Updating..." : "Publishing..."}
                </>
              ) : (
                <>{editPostSlug ? "💾 Update Post" : "🚀 Publish Post"}</>
              )}
            </button>
          </div>

          {mutation.isError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 font-medium">
                Error: {mutation.error.message}
              </p>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default Write;
