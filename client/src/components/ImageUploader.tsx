import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Upload, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect?: (file: File | null) => void;
  className?: string;
  placeholder?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  className = '',
  placeholder = 'Click to upload image or drag and drop'
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setError(null);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, GIF, etc.)');
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImagePreview(e.target.result as string);
        setUploadedFile(file);
        onImageSelect?.(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setUploadedFile(null);
    setError(null);
    onImageSelect?.(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
          dragOver
            ? 'border-electric-blue bg-electric-blue/10'
            : error
            ? 'border-red-500/50 bg-red-500/5'
            : imagePreview
            ? 'border-neon-green/50 bg-neon-green/5'
            : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="image-upload"
        />
        
        <div className="text-center space-y-4">
          {imagePreview ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full max-h-48 rounded-lg border border-white/20"
                />
                <button
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X size={14} className="text-white" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 text-neon-green">
                <CheckCircle size={16} />
                <span className="text-sm font-medium">
                  {uploadedFile?.name} ({(uploadedFile?.size || 0 / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
                dragOver ? 'bg-electric-blue/20' : 'bg-white/10'
              }`}>
                <Upload className={`w-8 h-8 ${
                  dragOver ? 'text-electric-blue' : 'text-white/60'
                }`} />
              </div>
              
              <div className="space-y-2">
                <p className="text-white font-medium">
                  {dragOver ? 'Drop your image here' : placeholder}
                </p>
                <p className="text-xs text-white/50">
                  Supports PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      )}
      
      {/* Upload Button Alternative */}
      <div className="text-center">
        <label
          htmlFor="image-upload"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer"
        >
          <Upload size={16} className="text-white/60" />
          <span className="text-white/80 font-medium">Choose File</span>
        </label>
      </div>
    </div>
  );
};

export default ImageUploader;