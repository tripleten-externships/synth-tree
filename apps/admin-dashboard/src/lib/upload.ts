export interface CanvasConfig {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D | null;
}

export async function drawCanvas(config: CanvasConfig): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  canvas.width = config.width; // Set your desired width
  canvas.height = config.height; // Set your desired height
  config.ctx = ctx;
  return canvas;
}

export async function drawImageOnCanvas(imageSrc: string, config: CanvasConfig): Promise<void> {
    const img = new Image();
    img.src = imageSrc;
    await img.decode();
    if (config.ctx) {
        config.ctx.drawImage(img, 0, 0, config.width, config.height);
    }
}


export interface CompressionConfig {
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
}

export async function compressImage(file: File, config: CompressionConfig): Promise<File> {
  if (file.type === "image/gif") return file;

  if (file.size <1024*1024) return file;
  const compressibleTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!compressibleTypes.includes(file.type)) {
    return file;
  }

  const blobUrl = URL.createObjectURL(file);

  try {
    const img = new Image();
    img.src = blobUrl;
    await img.decode();

    const maxDim = config.maxWidth || 1920;
    let newWidth = img.naturalWidth;
    let newHeight = img.naturalHeight;

    if (newWidth > maxDim || newHeight > maxDim) {
      const scale = Math.min(maxDim / newWidth, maxDim / newHeight);
      newWidth = Math.round(newWidth * scale);
      newHeight = Math.round(newHeight * scale);
    }

    const canvas = await drawCanvas({ width: newWidth, height: newHeight, ctx: null });
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    await drawImageOnCanvas(blobUrl, { width: newWidth, height: newHeight, ctx });

    const compressedBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, file.type, config.quality);
    });

    if (!compressedBlob || compressedBlob.size >= file.size) {
      return file;
    }

    return new File([compressedBlob], file.name, { type: file.type });
  } catch (error) {
    console.warn("Image compression failed, using original:", error);
    return file;
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}


export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export async function uploadFile(
    file: File, 
    uploadUrl: string, 
    onProgress?: (progress: UploadProgress) => void): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);

         xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        });
      }
    });


        xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve();
            } else {
                reject(new Error(`Upload failed with status ${xhr.status}`));
            }
        });

        xhr.addEventListener("error", () => reject(new Error("Upload failed due to a network error")));
        xhr.addEventListener("abort", () => reject(new Error("Upload was aborted")));
       
        xhr.send(file);
    });
}