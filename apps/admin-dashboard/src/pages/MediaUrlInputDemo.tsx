import { FormProvider, useForm } from 'react-hook-form';
import { MediaUrlInput } from '../components/MediaUrlInput';

interface FormData {
  mediaUrl: string;
  caption: string;
}

export function MediaUrlInputDemo() {
  const methods = useForm<FormData>({
    defaultValues: {
      mediaUrl: '',
      caption: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    alert(`Form Data:\nURL: ${data.mediaUrl}\nCaption: ${data.caption}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            MediaUrlInput Component Demo
          </h1>
          <p className="text-gray-600 mb-8">
            Test the MediaUrlInput component with different URLs
          </p>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
              <MediaUrlInput
                name="mediaUrl"
                label="Media URL"
                placeholder="Enter an image URL or YouTube/Vimeo video URL"
                captionName="caption"
                captionLabel="Caption (optional)"
                captionPlaceholder="Add a caption for accessibility"
              />

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => methods.reset()}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Reset
                </button>
              </div>
            </form>
          </FormProvider>

          {/* Example URLs Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Test URLs (click to copy)
            </h2>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Images:</h3>
                <div className="space-y-1">
                  {[
                    'https://picsum.photos/800/600',
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
                    'https://via.placeholder.com/600x400.png',
                  ].map((url) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => {
                        methods.setValue('mediaUrl', url);
                        navigator.clipboard.writeText(url);
                      }}
                      className="block w-full text-left px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 rounded text-blue-700 font-mono break-all"
                    >
                      {url}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">YouTube Videos:</h3>
                <div className="space-y-1">
                  {[
                    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    'https://youtu.be/jNQXAC9IVRw',
                    'https://www.youtube.com/embed/9bZkp7q19f0',
                  ].map((url) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => {
                        methods.setValue('mediaUrl', url);
                        navigator.clipboard.writeText(url);
                      }}
                      className="block w-full text-left px-3 py-2 text-sm bg-red-50 hover:bg-red-100 rounded text-red-700 font-mono break-all"
                    >
                      {url}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Vimeo Videos:</h3>
                <div className="space-y-1">
                  {[
                    'https://vimeo.com/148751763',
                    'https://vimeo.com/76979871',
                  ].map((url) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => {
                        methods.setValue('mediaUrl', url);
                        navigator.clipboard.writeText(url);
                      }}
                      className="block w-full text-left px-3 py-2 text-sm bg-green-50 hover:bg-green-100 rounded text-green-700 font-mono break-all"
                    >
                      {url}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Invalid/Test Cases:</h3>
                <div className="space-y-1">
                  {[
                    'not-a-valid-url',
                    'https://example.com/file.pdf',
                  ].map((url) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => {
                        methods.setValue('mediaUrl', url);
                        navigator.clipboard.writeText(url);
                      }}
                      className="block w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded text-gray-700 font-mono break-all"
                    >
                      {url}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
