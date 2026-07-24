import React, { useEffect, useRef, useState } from "react";
import { imagesUpload } from "../api/upload";
import { icons } from "../assiets/assiits";
import styles from "../styles/ImagePicker.module.scss";

export const ImagePicker = ({ onImageChange }) => {
  const camerInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelected = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await imagesUpload(formData);
      onImageChange?.({ filename: response.filename, url: response.url });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className={styles.imagePicker}>
      <button
        type="button"
        className={styles.cameraButton}
        onClick={() => galleryInputRef.current?.click()}
      >
        <img src={icons.UploadFolder} alt="Upload" />
      </button>
      <input
        type="file"
        accept="image/*"
        ref={galleryInputRef}
        onChange={handleFileSelected}
        style={{ display: "none" }}
      />

      <button
        type="button"
        className={styles.cameraButton}
        onClick={() => camerInputRef.current?.click()}
      >
        <img src={icons.camera} alt="Camera" />
      </button>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={camerInputRef}
        onChange={handleFileSelected}
        style={{ display: "none" }}
      />

      {uploading && <p>Uploading...</p>}
      {preview && <img src={preview} alt="preview" width={100} height={100} />}
    </div>
  );
};