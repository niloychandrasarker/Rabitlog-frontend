import { useAuth, useUser } from "@clerk/clerk-react";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../componenet/Upload";
import ImageAlignmentButtons from "../componenet/ImageAlignmentButtons";

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

  // Add simple image width control
  useEffect(() => {
    const handleImageClick = (e) => {
      if (e.target.tagName === "IMG" && e.target.closest(".ql-editor")) {
        const img = e.target;
        const currentWidth = img.style.width || img.offsetWidth + "px";
        const newWidth = prompt(
          `Current width: ${parseInt(
            currentWidth
          )}px\n\nEnter new width:\n- Number (e.g., 400) for pixels\n- Percentage (e.g., 50%)\n- Leave empty to keep current`,
          parseInt(currentWidth)
        );

        if (newWidth && newWidth.trim()) {
          const value = newWidth.trim();
          img.style.width = value.includes("%") ? value : value + "px";
          img.style.height = "auto";
          img.style.maxWidth = "100%";
        }
      }
    };

    // Add global click listener
    document.addEventListener("click", handleImageClick);

    return () => {
      document.removeEventListener("click", handleImageClick);
    };
  }, []);

  // Fetch post data if editing
  const {
    data: existingPost,
    isLoading: isPostLoading,
    isError: isPostError,
    error: postError,
  } = useQuery({
    queryKey: ["post-edit", editPostSlug],
    queryFn: async () => {
      if (!editPostSlug) return null;
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/${editPostSlug}`
      );
      return res.data;
    },
    enabled: !!editPostSlug,
    retry: 1,
    refetchOnWindowFocus: false,
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
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoaded && !isSignedIn) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="text-center">
          <p className="text-xl text-gray-700 mb-4">
            🔒 Authentication Required
          </p>
          <p className="text-gray-600">Please login to access this page</p>
        </div>
      </div>
    );
  }

  if (editPostSlug) {
    if (isPostLoading) {
      return (
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading post data...</p>
          </div>
        </div>
      );
    }

    if (isPostError) {
      return (
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="text-center max-w-md">
            <p className="text-xl text-red-600 mb-4">❌ Failed to Load Post</p>
            <p className="text-gray-600 mb-4">
              {postError?.response?.data?.message ||
                postError?.message ||
                "Something went wrong while fetching the post."}
            </p>
            <p className="text-sm text-gray-500 mb-4">Slug: {editPostSlug}</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go Back Home
            </button>
          </div>
        </div>
      );
    }

    if (!existingPost) {
      return (
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="text-center max-w-md">
            <p className="text-xl text-red-600 mb-4">❌ Post Not Found</p>
            <p className="text-gray-600 mb-4">
              We couldn&apos;t find a post with the provided slug.
            </p>
            <p className="text-sm text-gray-500 mb-4">Slug: {editPostSlug}</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go Back Home
            </button>
          </div>
        </div>
      );
    }
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6 border-b pb-3 sm:pb-4">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
          {showPreview
            ? "Preview Your Post"
            : editPostSlug
            ? "Edit Post"
            : "Create a New Post"}
        </h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${
              !showPreview
                ? "bg-blue-800 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <span className="hidden sm:inline">✏️ </span>Editor
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${
              showPreview
                ? "bg-blue-800 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <span className="hidden sm:inline">👁️ </span>Preview
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
          {/* Cover Image */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Cover Image
            </label>
            <Upload type="image" setProgress={setProgress} setData={setCover}>
              <button
                type="button"
                className="w-full sm:w-auto px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors text-gray-600 hover:text-blue-600 text-sm sm:text-base"
              >
                📷 {cover?.url ? "Change Cover" : "Add Cover"}
              </button>
            </Upload>
            {cover?.url && (
              <div className="mt-4 relative">
                <img
                  src={cover.url}
                  alt="Cover preview"
                  className="h-48 sm:h-64 w-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setCover(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              Post Title *
            </label>
            <input
              className="w-full text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-transparent outline-none border-b-2 border-gray-200 focus:border-blue-500 transition-colors pb-2"
              type="text"
              placeholder="Enter your awesome title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {formErrors.title && (
              <p className="text-xs sm:text-sm text-red-500 mt-2">
                {formErrors.title}
              </p>
            )}
          </div>

          {/* Category & Description */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 grid gap-4 sm:gap-6 md:grid-cols-2">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 sm:p-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
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
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Word Count
              </label>
              <div className="p-2.5 sm:p-3 rounded-lg bg-gray-50 border-2 border-gray-200">
                <span className="text-xl sm:text-2xl font-bold text-blue-600">
                  {
                    value
                      .replace(/<[^>]*>/g, "")
                      .replace(/&nbsp;/g, " ")
                      .trim()
                      .split(/\s+/)
                      .filter(Boolean).length
                  }
                </span>
                <span className="text-gray-600 ml-2 text-sm sm:text-base">
                  words
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
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
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Content *
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  💡 Click any image to resize it
                </p>
              </div>
              <div className="flex gap-2 sm:gap-3 items-center flex-wrap">
                <ImageAlignmentButtons quillRef={quillRef} />
                <div className="hidden sm:block h-6 w-px bg-gray-300" />
                <Upload type="image" setProgress={setProgress} setData={setImg}>
                  <button
                    type="button"
                    className="px-2.5 sm:px-3 py-1 text-xs sm:text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
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
                    className="px-2.5 sm:px-3 py-1 text-xs sm:text-sm bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    ▶️ Video
                  </button>
                </Upload>
              </div>
            </div>
            <div className="min-h-[300px] sm:min-h-[400px]">
              <ReactQuill
                value={value}
                onChange={setValue}
                theme="snow"
                modules={modules}
                formats={formats}
                className="bg-white rounded-lg h-full"
                ref={quillRef}
                placeholder="Start writing your amazing content here..."
              />
            </div>
            {formErrors.content && (
              <p className="text-xs sm:text-sm text-red-500 mt-2">
                {formErrors.content}
              </p>
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
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
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
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || (0 < progress && progress < 100)}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base text-white bg-blue-800 hover:bg-blue-900 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
