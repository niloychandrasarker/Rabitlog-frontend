const Image = ({ src = "", className = "", alt = "", w, h }) => {
  const endpoint = import.meta.env.VITE_IK_URL_ENDPOINT || "";
  const isAbsolute = /^https?:\/\//i.test(src);
  const trimmedSrc = typeof src === "string" ? src.replace(/^\/+/, "") : "";
  const imageSrc = isAbsolute
    ? trimmedSrc
    : endpoint
    ? `${endpoint.replace(/\/+$/, "")}/${trimmedSrc}`
    : trimmedSrc;

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      width={w}
      height={h}
      loading="lazy"
    />
  );
};

export default Image;
