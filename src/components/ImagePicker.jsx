import React, { useRef, useState } from "react";
import { imagesUpload } from "../api/upload";
import Camera from "./icons/Camera";
import Upload from "./icons/Upload";
import { icons } from "../assiets/assiits";
import styles from "../styles/ImagePicker.module.scss";


export const ImagePicker = ({ onImageChange }) => {
  const camerInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [Uploading, setUploading] = useState(false);

  const handleFileSelected = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await imagesUpload(formData);
      onImageChange?.({ filename: response.filename, url: response.url });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return(
  <div className={styles.imagePicker}>
    <button className={styles.cameraButton} 
    onClick={() => camerInputRef.current?.click()}
    >
      <img src={icons.UploadFolder} />
    </button>
    <input
      type="file"
      accept="image/*"
      ref={galleryInputRef}
      onChange={handleFileSelected}
      style={{ display: "none" }}
    />
   

    <button className={styles.cameraButton}
    onClick={() => galleryInputRef.current?.click()}
    >
      <img src={icons.cameraButton} />
    </button>
     <input
      type="file"
      accept="image/*"
      capture="environment"
      ref={camerInputRef}
      onChange={handleFileSelected}
      style={{ display: "none" }}
    />
  </div>
  )
};
