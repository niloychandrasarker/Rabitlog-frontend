import { useRef } from "react";
import { toast } from "react-toastify";

const fetchAuthParams = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/upload-auth`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`upload-auth failed: ${res.status} ${text}`);
  }
  return res.json();
};

const uploadToImageKit = ({ formData, onProgress }) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://upload.imagekit.io/api/v1/files/upload");

    xhr.upload.onprogress = (evt) => {
      if (!evt.lengthComputable || typeof onProgress !== "function") return;
      onProgress(Math.round((evt.loaded / evt.total) * 100));
    };

    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(json);
        } else {
          reject(json || new Error(`Upload failed with status ${xhr.status}`));
        }
      } catch (err) {
        reject(err);
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));

    try {
      xhr.send(formData);
    } catch (err) {
      reject(err);
    }
  });

const Upload = ({ children, type = "image", setProgress, setData }) => {
  const inputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    try {
      const auth = await fetchAuthParams();

      const form = new FormData();
      form.append("file", file);
      form.append("fileName", file.name);
      if (import.meta.env.VITE_IK_PUBLIC_KEY) {
        form.append("publicKey", import.meta.env.VITE_IK_PUBLIC_KEY);
      }
      if (auth?.signature) form.append("signature", auth.signature);
      if (auth?.expire) form.append("expire", auth.expire);
      if (auth?.token) form.append("token", auth.token);

      const result = await uploadToImageKit({
        formData: form,
        onProgress: (pct) => setProgress && setProgress(pct),
      });

      setData && setData(result);
      toast.success("Upload successful");
    } catch (err) {
      console.error("upload error", err);
      toast.error("Image upload failed");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
      if (setProgress) setProgress(0);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept={`${type}/*`}
        onChange={handleFileChange}
      />
      <div
        className="cursor-pointer"
        onClick={() => inputRef.current && inputRef.current.click()}
      >
        {children}
      </div>
    </>
  );
};

export default Upload;
