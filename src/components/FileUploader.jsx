import React, { useRef } from "react";

export const FileUploader = ({ 
  onFileSelect, 
  accept = "*", 
  children, 
  className = "" 
}) => {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={`cursor-pointer ${className}`}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      {children}
    </div>
  );
};