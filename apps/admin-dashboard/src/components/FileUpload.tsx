import { useRef, useState } from "react";
import { useMutation } from "@apollo/client/react";

import { uploadFile } from "../lib/upload";
import { GENERATE_UPLOAD_URL } from "../graphql/mutations";
import styles from "./FileUpload.module.css";

interface FileUploadProps {
  accept?: "image" | "video" | "both";
  onUploadComplete: (url: string) => void;
  onRemove?: () => void;
  currentUrl?: string;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  accept = "both", 
  onUploadComplete, 
  onRemove, 
  currentUrl, 
  className 
}) => {
  const [state, setState] = useState<"idle" | "validating" | "uploading" | "complete" | "error">("idle");
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(currentUrl || null);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [generateUploadUrl] = useMutation(GENERATE_UPLOAD_URL);

  const validate = (file: File): string | null => {
    const maxImageSize = 10 * 1024 * 1024;
    const maxVideoSize = 100 * 1024 * 1024;

    if ((accept === "image" || accept === "both") && file.size > maxImageSize && file.type.startsWith("image/")) {
      return "Image size exceeds 10MB limit.";
    }
    if ((accept === "video" || accept === "both") && file.size > maxVideoSize && file.type.startsWith("video/")) {
      return "Video size exceeds 100MB limit.";
    }

    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const allowedVideoTypes = ["video/mp4", "video/webm"];
    
    let allowedTypes: string[] = [];
    if (accept === "image") {
      allowedTypes = allowedImageTypes;
    } else if (accept === "video") {
      allowedTypes = allowedVideoTypes;
    } else if (accept === "both") {
      allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];
    }
    
    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`;
    }
    return null;
  };

  // Generate video poster/thumbnail from first frame
  const generatePosterFrame = (videoFile: File) => {
    const url = URL.createObjectURL(videoFile);
    const video = document.createElement('video');
    video.src = url;
    video.onloadedmetadata = () => {
      video.currentTime = 0.5; // Get frame at 0.5 seconds
    };
    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const posterDataUrl = canvas.toDataURL('image/jpeg');
        setPosterUrl(posterDataUrl);
      }
      URL.revokeObjectURL(url);
    };
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      const validationError = validate(droppedFile);
      if (validationError) {
        setError(validationError);
        setState("error");
      } else {
        setError(null);
        setFileUrl(URL.createObjectURL(droppedFile));
        
        // Generate poster for videos
        if ((accept === "video" || accept === "both") && droppedFile.type.startsWith("video/")) {
          generatePosterFrame(droppedFile);
        }
        
        setState("validating");
        handleUploadFile(droppedFile);
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const validationError = validate(selectedFile);
      if (validationError) {
        setError(validationError);
        setState("error");
      } else {
        setError(null);
        setFileUrl(URL.createObjectURL(selectedFile));
        
        // Generate poster for videos
        if ((accept === "video" || accept === "both") && selectedFile.type.startsWith("video/")) {
          generatePosterFrame(selectedFile);
        }
        
        setState("validating");
        handleUploadFile(selectedFile);
      }
    }
  };

  const handleUploadFile = async (fileToUpload: File) => {
    setState("uploading");
    try {
      const { data } = await generateUploadUrl({
        variables: {
          fileName: fileToUpload.name,
          contentType: fileToUpload.type,
          fileSize: fileToUpload.size,
        },
      });

      const generateUrlData = data as { generateUploadUrl?: { uploadUrl: string; publicUrl: string } } | undefined;
      if (generateUrlData?.generateUploadUrl) {
        await uploadFile(fileToUpload, generateUrlData.generateUploadUrl.uploadUrl, (prog) => {
          setProgress(prog.percentage);
        });
        setState("complete");
        onUploadComplete(generateUrlData.generateUploadUrl.publicUrl);
      } else {
        setError("Failed to get upload URL.");
        setState("error");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setState("error");
    }
  };

  return (
    <div className={className}>
      {state === "idle" && (
        <div 
          onDragOver={handleDragOver} 
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={styles.dropZone}
        >
          <div className={styles.icon}>
            {accept === "image" ? "image" : accept === "video" ? "video" : "file"}
          </div>
          <p className={styles.title}>
            Drag & drop your {accept === "both" ? "file" : accept} here or click to browse
          </p>
          <p className={styles.subtitle}>
            {accept === "image" 
              ? "JPEG, PNG, GIF, WebP up to 10MB" 
              : accept === "video"
              ? "MP4, WebM up to 100MB"
              : "Images (JPEG, PNG, GIF, WebP up to 10MB) or Videos (MP4, WebM up to 100MB)"}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept={accept === "image" ? "image/*" : accept === "video" ? "video/*" : "image/*,video/*"}
            className={styles.fileInput}
            title={`Select ${accept === "both" ? "image or video" : accept} file`}
          />
        </div>
      )}

      {state === "validating" && (
        <div className={styles.validating}>
          <div className={styles.spinner}>
            ⏳
          </div>
          <p>Checking file...</p>
        </div>
      )}

      {state === "uploading" && (
        <div className={styles.uploading}>
          <p className={styles.uploadingText}>Uploading... {progress}%</p>
          <div className={styles.progressContainer}>
            <div 
              className={`${styles.progressBar} ${styles[`progress${Math.round(progress / 10) * 10}`]}`}
            />
          </div>
        </div>
      )}

      {state === "complete" && (
        <div className={styles.complete}>
          {fileUrl && (fileUrl.startsWith("blob:") || /\.(jpeg|jpg|png|gif|webp)/.test(fileUrl)) ? (
            <img 
              src={fileUrl || ""} 
              alt="preview" 
              className={styles.preview}
            />
          ) : posterUrl ? (
            <video 
              ref={videoRef}
              src={fileUrl || ""} 
              controls 
              poster={posterUrl}
              className={styles.videoPreview}
            />
          ) : (
            <video 
              ref={videoRef}
              src={fileUrl || ""} 
              controls 
              className={styles.videoPreview}
            />
          )}
          <div className={styles.buttonContainer}>
            <button 
              onClick={() => {
                setState("idle");
                setFileUrl(null);
                setPosterUrl(null);
                setProgress(0);
              }}
              className={`${styles.button} ${styles.buttonPrimary}`}
            >
              Upload another
            </button>
            {onRemove && (
              <button 
                onClick={() => {
                  onRemove();
                  setState("idle");
                  setFileUrl(null);
                  setPosterUrl(null);
                }}
                className={`${styles.button} ${styles.buttonDanger}`}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      )}

      {state === "error" && (
        <div className={styles.error}>
          <p className={styles.errorText}>X {error}</p>
          <button 
            onClick={() => {
              setState("idle");
              setError(null);
            }}
            className={styles.errorButton}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;