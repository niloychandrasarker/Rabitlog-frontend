const ImageAlignmentButtons = ({ quillRef }) => {
  const handleAlignment = (alignment) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const editorElement = editor.root;

      // Get all images in the editor
      const images = editorElement.querySelectorAll("img");

      // Find selected/focused image or use the last inserted image
      let targetImg = null;

      // Check for selected image
      const selection = window.getSelection();
      if (selection.focusNode) {
        const node =
          selection.focusNode.nodeType === 1
            ? selection.focusNode
            : selection.focusNode.parentNode;

        if (node.tagName === "IMG") {
          targetImg = node;
        } else {
          targetImg = node.querySelector("img");
        }
      }

      // If no selection, use the last image
      if (!targetImg && images.length > 0) {
        targetImg = images[images.length - 1];
      }

      if (targetImg) {
        // Remove all alignment classes
        targetImg.classList.remove(
          "ql-align-left",
          "ql-align-center",
          "ql-align-right"
        );

        // Reset inline styles
        targetImg.style.float = "";
        targetImg.style.marginLeft = "";
        targetImg.style.marginRight = "";
        targetImg.style.display = "";

        // Add new alignment
        if (alignment === "left") {
          targetImg.classList.add("ql-align-left");
          targetImg.style.float = "left";
          targetImg.style.marginRight = "20px";
          targetImg.style.marginBottom = "10px";
        } else if (alignment === "right") {
          targetImg.classList.add("ql-align-right");
          targetImg.style.float = "right";
          targetImg.style.marginLeft = "20px";
          targetImg.style.marginBottom = "10px";
        } else if (alignment === "center") {
          targetImg.classList.add("ql-align-center");
          targetImg.style.display = "block";
          targetImg.style.marginLeft = "auto";
          targetImg.style.marginRight = "auto";
        }

        // Visual feedback
        targetImg.style.outline = "3px solid #3b82f6";
        targetImg.style.outlineOffset = "2px";

        setTimeout(() => {
          targetImg.style.outline = "";
          targetImg.style.outlineOffset = "";
        }, 1000);
      }
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <span className="text-xs font-medium text-gray-600">Image Position:</span>
      <button
        type="button"
        onClick={() => handleAlignment("left")}
        className="px-3 py-1 text-xs bg-gray-100 hover:bg-blue-100 hover:text-blue-600 rounded transition-colors font-medium"
        title="Align Left - Text wraps on right"
      >
        ⬅️ Left
      </button>
      <button
        type="button"
        onClick={() => handleAlignment("center")}
        className="px-3 py-1 text-xs bg-gray-100 hover:bg-blue-100 hover:text-blue-600 rounded transition-colors font-medium"
        title="Align Center"
      >
        ↔️ Center
      </button>
      <button
        type="button"
        onClick={() => handleAlignment("right")}
        className="px-3 py-1 text-xs bg-gray-100 hover:bg-blue-100 hover:text-blue-600 rounded transition-colors font-medium"
        title="Align Right - Text wraps on left"
      >
        ➡️ Right
      </button>
    </div>
  );
};

export default ImageAlignmentButtons;
