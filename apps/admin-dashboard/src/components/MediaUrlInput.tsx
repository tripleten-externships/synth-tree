import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

interface MediaUrlInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  captionName?: string;
  captionLabel?: string;
  captionPlaceholder?: string;
}

interface VideoProvider {
  type: 'youtube' | 'vimeo';
  id: string;
  embedUrl: string;
}


const IMAGE_EXTENSIONS = /\.(jpeg|jpg|png|gif|webp)(\?.*)?$/i;


const YOUTUBE_REGEX = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;

const VIMEO_REGEX = /(?:vimeo\.com\/)(\d+)/;


function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}


function isImageUrl(url: string): boolean {
  if (!isValidUrl(url)) return false;
  return IMAGE_EXTENSIONS.test(url);
}


function getVideoProvider(url: string): VideoProvider | null {
  if (!isValidUrl(url)) return null;

  
  const youtubeMatch = url.match(YOUTUBE_REGEX);
  if (youtubeMatch && youtubeMatch[1]) {
    return {
      type: 'youtube',
      id: youtubeMatch[1],
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
    };
  }

 
  const vimeoMatch = url.match(VIMEO_REGEX);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      id: vimeoMatch[1],
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  return null;
}

export function MediaUrlInput({
  name,
  label = 'Media URL',
  placeholder = 'https://example.com/image.jpg or YouTube/Vimeo URL',
  captionName,
  captionLabel = 'Caption',
  captionPlaceholder = 'Enter a caption for this media (optional)',
}: MediaUrlInputProps) {
  const { register, watch, formState: { errors } } = useFormContext();
  
  const urlValue = watch(name) as string;
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [videoProvider, setVideoProvider] = useState<VideoProvider | null>(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

 
  useEffect(() => {
    if (!urlValue || urlValue.trim() === '') {
      setMediaType(null);
      setVideoProvider(null);
      setImageError(false);
      return;
    }

    
    if (!isValidUrl(urlValue)) {
      setMediaType(null);
      setVideoProvider(null);
      return;
    }

    
    const provider = getVideoProvider(urlValue);
    if (provider) {
      setMediaType('video');
      setVideoProvider(provider);
      setImageError(false);
      return;
    }

    
    if (isImageUrl(urlValue)) {
      setMediaType('image');
      setVideoProvider(null);
      setImageLoading(true);
      setImageError(false);
      return;
    }

    
    setMediaType(null);
    setVideoProvider(null);
  }, [urlValue]);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const urlError = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-4">
      {/* URL Input */}
      <div>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
        <input
          id={name}
          type="url"
          {...register(name, {
            validate: (value: string) => {
              if (!value || value.trim() === '') return true; // Allow empty if not required
              if (!isValidUrl(value)) {
                return 'Please enter a valid URL';
              }
              return true;
            },
          })}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            urlError ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {urlError && (
          <p className="mt-1 text-sm text-red-600">{urlError}</p>
        )}
        {urlValue && isValidUrl(urlValue) && !mediaType && !videoProvider && (
          <p className="mt-1 text-sm text-yellow-600">
            URL is valid but not recognized as an image or supported video (YouTube/Vimeo)
          </p>
        )}
      </div>

      {/* Caption Input */}
      {captionName && (
        <div>
          <label
            htmlFor={captionName}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {captionLabel}
          </label>
          <input
            id={captionName}
            type="text"
            {...register(captionName)}
            placeholder={captionPlaceholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {/* Media Preview */}
      {mediaType === 'image' && urlValue && isValidUrl(urlValue) && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
          <div className="relative border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
            {imageError ? (
              <div className="p-8 text-center text-red-600">
                <p className="text-sm">Failed to load image. Please check the URL.</p>
              </div>
            ) : (
              <img
                src={urlValue}
                alt="Preview"
                onLoad={handleImageLoad}
                onError={handleImageError}
                className="max-w-full h-auto max-h-96 mx-auto"
              />
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Supported formats: JPEG, PNG, GIF, WebP
          </p>
        </div>
      )}

      {/* Video Preview */}
      {mediaType === 'video' && videoProvider && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Video Preview ({videoProvider.type === 'youtube' ? 'YouTube' : 'Vimeo'}):
          </p>
          <div className="relative border border-gray-300 rounded-lg overflow-hidden bg-black aspect-video">
            <iframe
              src={videoProvider.embedUrl}
              title="Video preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Video ID: {videoProvider.id}
          </p>
        </div>
      )}
    </div>
  );
}


export function extractVideoMeta(url: string): { provider: string; videoId: string } | null {
  const provider = getVideoProvider(url);
  if (!provider) return null;
  
  return {
    provider: provider.type,
    videoId: provider.id,
  };
}
