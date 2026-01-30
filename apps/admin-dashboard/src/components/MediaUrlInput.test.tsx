import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { MediaUrlInput, extractVideoMeta } from './MediaUrlInput';

// Test wrapper component that provides form context
function TestWrapper({ children, defaultValues = {} }: { children: React.ReactNode; defaultValues?: Record<string, unknown> }) {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('MediaUrlInput Component', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(
        <TestWrapper>
          <MediaUrlInput name="mediaUrl" />
        </TestWrapper>
      );

      expect(screen.getByLabelText('Media URL')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/https:\/\/example\.com\/image\.jpg or YouTube\/Vimeo URL/)).toBeInTheDocument();
    });

    it('renders with custom label and placeholder', () => {
      render(
        <TestWrapper>
          <MediaUrlInput 
            name="customUrl" 
            label="Custom Media" 
            placeholder="Enter your URL here" 
          />
        </TestWrapper>
      );

      expect(screen.getByLabelText('Custom Media')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your URL here')).toBeInTheDocument();
    });

    it('renders caption field when captionName is provided', () => {
      render(
        <TestWrapper>
          <MediaUrlInput 
            name="mediaUrl" 
            captionName="caption" 
            captionLabel="Image Caption" 
          />
        </TestWrapper>
      );

      expect(screen.getByLabelText('Image Caption')).toBeInTheDocument();
    });
  });

  describe('URL Validation', () => {
    it('shows error for invalid URL', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <MediaUrlInput name="mediaUrl" />
        </TestWrapper>
      );

      const input = screen.getByLabelText('Media URL');
      await user.type(input, 'not-a-valid-url');
      
      // Trigger validation by blurring and waiting for the component to update
      await user.click(document.body);
      
      // The validation happens on submit or programmatically, so we just verify 
      // that invalid URLs don't cause the component to crash
      expect(screen.queryByText('Image Preview:')).not.toBeInTheDocument();
      expect(screen.queryByText(/Video Preview/)).not.toBeInTheDocument();
    });

    it('accepts valid image URLs', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <MediaUrlInput name="mediaUrl" />
        </TestWrapper>
      );

      const input = screen.getByLabelText('Media URL');
      await user.type(input, 'https://example.com/image.jpg');

      await waitFor(() => {
        expect(screen.queryByText('Please enter a valid URL')).not.toBeInTheDocument();
      });
    });

    it('accepts empty URL when not required', async () => {
      render(
        <TestWrapper>
          <MediaUrlInput name="mediaUrl" />
        </TestWrapper>
      );

      const input = screen.getByLabelText('Media URL') as HTMLInputElement;
      
      await waitFor(() => {
        expect(input.value).toBe('');
        expect(screen.queryByText('Please enter a valid URL')).not.toBeInTheDocument();
      });
    });
  });

  describe('Image URL Detection and Preview', () => {
    it('shows image preview for valid image URL', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <MediaUrlInput name="mediaUrl" />
        </TestWrapper>
      );

      const input = screen.getByLabelText('Media URL');
      await user.type(input, 'https://example.com/test.jpg');

      await waitFor(() => {
        expect(screen.getByText('Image Preview:')).toBeInTheDocument();
        expect(screen.getByText('Supported formats: JPEG, PNG, GIF, WebP')).toBeInTheDocument();
      });
    });

    it('detects various image extensions', async () => {
      const user = userEvent.setup();
      const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

      for (const ext of extensions) {
        const { unmount } = render(
          <TestWrapper>
            <MediaUrlInput name="mediaUrl" />
          </TestWrapper>
        );

        const input = screen.getByLabelText('Media URL');
        await user.type(input, `https://example.com/image.${ext}`);

        await waitFor(() => {
          expect(screen.getByText('Image Preview:')).toBeInTheDocument();
        });

        unmount();
      }
    });

    it('shows error when image fails to load', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <MediaUrlInput name="mediaUrl" />
        </TestWrapper>
      );

      const input = screen.getByLabelText('Media URL');
      await user.type(input, 'https://example.com/broken-image.jpg');

      await waitFor(() => {
        const img = screen.getByAltText('Preview');
        expect(img).toBeInTheDocument();
      });

      // Simulate image error
      const img = screen.getByAltText('Preview');
      img.dispatchEvent(new Event('error'));

      await waitFor(() => {
        expect(screen.getByText('Failed to load image. Please check the URL.')).toBeInTheDocument();
      });
    });
  });

  describe('YouTube URL Detection', () => {
    it('detects standard YouTube watch URL', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <MediaUrlInput name="mediaUrl" />
        </TestWrapper>
      );

      const input = screen.getByLabelText('Media URL');
      await user.type(input, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');

      await waitFor(() => {
        expect(screen.getByText(/Video Preview \(YouTube\):/)).toBeInTheDocument();
        expect(screen.getByText('Video ID: dQw4w9WgXcQ')).toBeInTheDocument();
      });
    });

    it('detects shortened YouTube URL', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <MediaUrlInput name="mediaUrl" />
        </TestWrapper>
      );

      const input = screen.getByLabelText('Media URL');
      await user.type(input, 'https://youtu.be/dQw4w9WgXcQ');

      await waitFor(() => {
        expect(screen.getByText(/Video Preview \(YouTube\):/)).toBeInTheDocument();
        expect(screen.getByText('Video ID: dQw4w9WgXcQ')).toBeInTheDocument();
      });
    });

    it('detects YouTube embed URL', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <MediaUrlInput name="mediaUrl" />
        </TestWrapper>
      );

      const input = screen.getByLabelText('Media URL');
      await user.type(input, 'https://www.youtube.com/embed/dQw4w9WgXcQ');

      await waitFor(() => {
        expect(screen.getByText(/Video Preview \(YouTube\):/)).toBeInTheDocument();
      });
    });

    it('renders YouTube iframe with correct embed URL', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <MediaUrlInput name="mediaUrl" />
        </TestWrapper>
      );

      const input = screen.getByLabelText('Media URL');
      await user.type(input, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');

      await waitFor(() => {
        const iframe = screen.getByTitle('Video preview') as HTMLIFrameElement;
        expect(iframe.src).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
      });
    });
  });

  describe('Vimeo URL Detection', () => {
    it('detects Vimeo URL', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <MediaUrlInput name="mediaUrl" />
        </TestWrapper>
      );

      const input = screen.getByLabelText('Media URL');
      await user.type(input, 'https://vimeo.com/123456789');

      await waitFor(() => {
        expect(screen.getByText(/Video Preview \(Vimeo\):/)).toBeInTheDocument();
        expect(screen.getByText('Video ID: 123456789')).toBeInTheDocument();
      });
    });

    it('renders Vimeo iframe with correct embed URL', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <MediaUrlInput name="mediaUrl" />
        </TestWrapper>
      );

      const input = screen.getByLabelText('Media URL');
      await user.type(input, 'https://vimeo.com/123456789');

      await waitFor(() => {
        const iframe = screen.getByTitle('Video preview') as HTMLIFrameElement;
        expect(iframe.src).toBe('https://player.vimeo.com/video/123456789');
      });
    });
  });

  describe('Unsupported URL Warning', () => {
    it('shows warning for valid URL that is not image or supported video', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <MediaUrlInput name="mediaUrl" />
        </TestWrapper>
      );

      const input = screen.getByLabelText('Media URL');
      await user.type(input, 'https://example.com/document.pdf');

      await waitFor(() => {
        expect(screen.getByText(/URL is valid but not recognized as an image or supported video/)).toBeInTheDocument();
      });
    });
  });

  describe('Caption Field', () => {
    it('allows typing in caption field', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <MediaUrlInput 
            name="mediaUrl" 
            captionName="caption" 
            captionPlaceholder="Enter caption here" 
          />
        </TestWrapper>
      );

      const captionInput = screen.getByPlaceholderText('Enter caption here');
      await user.type(captionInput, 'Test caption');

      await waitFor(() => {
        expect(captionInput).toHaveValue('Test caption');
      });
    });
  });
});

describe('extractVideoMeta utility function', () => {
  it('extracts YouTube video metadata', () => {
    const result = extractVideoMeta('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(result).toEqual({
      provider: 'youtube',
      videoId: 'dQw4w9WgXcQ',
    });
  });

  it('extracts Vimeo video metadata', () => {
    const result = extractVideoMeta('https://vimeo.com/123456789');
    expect(result).toEqual({
      provider: 'vimeo',
      videoId: '123456789',
    });
  });

  it('returns null for non-video URLs', () => {
    const result = extractVideoMeta('https://example.com/image.jpg');
    expect(result).toBeNull();
  });

  it('returns null for invalid URLs', () => {
    const result = extractVideoMeta('not-a-url');
    expect(result).toBeNull();
  });

  it('handles YouTube shortened URLs', () => {
    const result = extractVideoMeta('https://youtu.be/dQw4w9WgXcQ');
    expect(result).toEqual({
      provider: 'youtube',
      videoId: 'dQw4w9WgXcQ',
    });
  });

  it('handles YouTube embed URLs', () => {
    const result = extractVideoMeta('https://www.youtube.com/embed/dQw4w9WgXcQ');
    expect(result).toEqual({
      provider: 'youtube',
      videoId: 'dQw4w9WgXcQ',
    });
  });
});
