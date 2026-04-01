// Tweet Composer Component
import React, { useState } from 'react';
import { twitterService } from '../services/twitterService';
import { Twitter, Instagram, Music, Send, Loader2, Image, Palette, AlertCircle } from 'lucide-react';
import LineOptionsSimple from './LineOptionsSimple';
import ImageUploader from './ImageUploader';
import ImageHandler from '../services/imageHandler';
import toast from 'react-hot-toast';

const platforms = [
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-blue-500' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { id: 'tiktok', name: 'TikTok', icon: Music, color: 'bg-black' }
];

export const TweetComposer = () => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter']);
  const [mediaUrl, setMediaUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [posting, setPosting] = useState(false);
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [showLineOptions, setShowLineOptions] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedLineOption, setSelectedLineOption] = useState(null);
  const [imageValidationError, setImageValidationError] = useState<string | null>(null);

  const maxLength = 280;
  const remainingChars = maxLength - content.length;

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleLineOptionSelect = (option) => {
    setSelectedLineOption(option);
    toast.success(`Selected ${option.name} for visual content`);
  };

  const handleImageSelect = async (file: File | null) => {
    setImageValidationError(null);
    
    if (!file) {
      setSelectedImage(null);
      return;
    }

    try {
      // Validate the image
      const validation = await ImageHandler.validateImage(file);
      
      if (!validation.isValid) {
        setImageValidationError(validation.error || 'Invalid image file');
        toast.error(validation.error || 'Invalid image file');
        return;
      }

      // If validation passes, set the image
      setSelectedImage(file);
      toast.success(`Image uploaded successfully (${validation.dimensions?.width}x${validation.dimensions?.height})`);
      
      // Auto-close URL input if image is uploaded
      if (showMediaInput) {
        setShowMediaInput(false);
        setMediaUrl('');
      }
    } catch (error) {
      const errorMsg = 'Failed to process image file';
      setImageValidationError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handlePost = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    if (content.length > maxLength) {
      toast.error(`Content is too long (max ${maxLength} characters)`);
      return;
    }

    // If Instagram is selected, require media
    if (selectedPlatforms.includes('instagram') && !mediaUrl && !selectedImage) {
      toast.error('Instagram requires an image. Please upload an image or provide a URL.');
      return;
    }

    try {
      setPosting(true);
      
      let finalMediaUrl = mediaUrl;
      
      // If we have an uploaded image, we would typically upload it to a server here
      // For now, we'll create a local URL for demonstration
      if (selectedImage && !mediaUrl) {
        finalMediaUrl = URL.createObjectURL(selectedImage);
      }
      
      const result = await twitterService.postContent(
        selectedPlatforms,
        content,
        finalMediaUrl || undefined
      );

      // Show results
      const successful = Object.entries(result.results).filter(([_, r]) => r.success);
      const failed = Object.entries(result.results).filter(([_, r]) => !r.success);

      if (successful.length > 0) {
        toast.success(`Posted to ${successful.map(([p]) => p).join(', ')}!`);
      }

      if (failed.length > 0) {
        toast.error(`Failed to post to ${failed.map(([p]) => p).join(', ')}`);
      }

      // Reset form if all successful
      if (failed.length === 0) {
        setContent('');
        setMediaUrl('');
        setSelectedImage(null);
        setShowMediaInput(false);
        setShowLineOptions(false);
        setShowImageUpload(false);
        setSelectedLineOption(null);
        setImageValidationError(null);
      }
    } catch (error: unknown) {
      console.error('Failed to post:', error);
      // @ts-ignore
      toast.error((error && (error as any).message) || 'Failed to post content');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Post</h2>

      {/* Platform Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Platforms
        </label>
        <div className="flex flex-wrap gap-2">
          {platforms.map(platform => {
            const Icon = platform.icon;
            const isSelected = selectedPlatforms.includes(platform.id);

            return (
              <button
                key={platform.id}
                onClick={() => handlePlatformToggle(platform.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isSelected
                    ? `${platform.color} text-white`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon size={18} />
                <span>{platform.name}</span>
              </button>
            );
          })}
        </div>
        {selectedPlatforms.includes('instagram') && !mediaUrl && !selectedImage && (
          <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
            <AlertCircle size={12} />
            Instagram requires an image
          </p>
        )}
      </div>

      {/* Content Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
          maxLength={maxLength}
        />
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setShowMediaInput(!showMediaInput)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-500"
            >
              <Image size={16} />
              <span>{showMediaInput ? 'Hide' : 'Add'} Media URL</span>
            </button>
            
            <button
              onClick={() => setShowImageUpload(!showImageUpload)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-500"
            >
              <Image size={16} />
              <span>{showImageUpload ? 'Hide' : 'Upload'} Image</span>
            </button>
            
            <button
              onClick={() => setShowLineOptions(!showLineOptions)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-500"
            >
              <Palette size={16} />
              <span>{showLineOptions ? 'Hide' : 'Show'} Line Options</span>
            </button>
          </div>
          <span className={`text-sm ${
            remainingChars < 20 ? 'text-red-500 font-medium' : 'text-gray-500'
          }`}>
            {remainingChars} characters remaining
          </span>
        </div>
      </div>

      {/* Media URL Input */}
      {showMediaInput && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Media URL (optional)
          </label>
          <input
            type="url"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Note: Instagram requires media content
          </p>
        </div>
      )}

      {/* Image Upload */}
      {showImageUpload && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          <ImageUploader
            onImageSelect={handleImageSelect}
            placeholder="Upload an image for your post"
          />
          {imageValidationError && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {imageValidationError}
            </div>
          )}
        </div>
      )}

      {/* Line Options */}
      {showLineOptions && (
        <div className="mb-4 p-4 bg-gray-900 rounded-lg">
          <LineOptionsSimple 
            onLineSelect={handleLineOptionSelect}
            selectedLineId={selectedLineOption?.id}
          />
          {selectedLineOption && (
            <div className="mt-4 p-3 bg-white/10 rounded-lg">
              <p className="text-white text-sm">
                ✨ Line option selected: <strong>{selectedLineOption.name}</strong>
                <br />
                <span className="text-white/70">Perfect for creating visual content with styled borders and dividers!</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Selected Image/Media Preview */}
      {(selectedImage || mediaUrl) && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">Media attached:</p>
          {selectedImage && (
            <div className="text-sm text-gray-600">
              📎 {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
          {mediaUrl && (
            <div className="text-sm text-gray-600">
              🔗 {mediaUrl}
            </div>
          )}
        </div>
      )}

      {/* Post Button */}
      <button
        onClick={handlePost}
        disabled={posting || !content.trim() || selectedPlatforms.length === 0}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {posting ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>Posting...</span>
          </>
        ) : (
          <>
            <Send size={20} />
            <span>Post to {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}</span>
          </>
        )}
      </button>
    </div>
  );
};
