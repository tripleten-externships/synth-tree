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