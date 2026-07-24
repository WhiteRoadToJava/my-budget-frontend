import React, { useState } from "react";
import { imagesUpload } from "../../api/upload";
import { ImagePicker } from "../ImagePicker";

export const UploadComponentTest = () => {
  const [imageUrls, setImageUrls] = useState(null);

  const handleImagesUploading = async (event) => {
    const selectedFile = event.target.files[0];
    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await imagesUpload(formData);
    setImageUrls(response.url);

  };
  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImagesUploading} />
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImagesUploading}
      />
      {imageUrls && (
        <img
          src={imageUrls}
          alt="uploaded"
          width={300}
          height={300}
          style={{
            background: "red",
            borderRadius: "50%",
            minHeight: "300px",
            minWidth: "300px",
            border: "1px solid black",
          }}
        />
      )}

      <div>
        <ImagePicker onImageChange={setImageUrls} />
      </div>
    </div>
  );
};
