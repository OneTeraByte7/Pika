/**
 * Image handling utilities for Pika AI
 * Handles image validation, optimization, and error recovery
 */

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  dimensions?: { width: number; height: number };
  size?: number;
  format?: string;
}

export class ImageHandler {
  static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  static readonly SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  static readonly MAX_DIMENSIONS = { width: 4096, height: 4096 };

  /**
   * Validate an image file
   */
  static validateImage(file: File): Promise<ImageValidationResult> {
    return new Promise((resolve) => {
      // Check file type
      if (!this.SUPPORTED_FORMATS.includes(file.type)) {
        resolve({
          isValid: false,
          error: `Unsupported file format. Supported: ${this.SUPPORTED_FORMATS.join(', ')}`
        });
        return;
      }

      // Check file size
      if (file.size > this.MAX_FILE_SIZE) {
        resolve({
          isValid: false,
          error: `File size exceeds maximum limit of ${(this.MAX_FILE_SIZE / 1024 / 1024).toFixed(1)}MB`
        });
        return;
      }

      // Load image to check dimensions and validate content
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        try {
          // Check dimensions
          if (img.width > this.MAX_DIMENSIONS.width || img.height > this.MAX_DIMENSIONS.height) {
            resolve({
              isValid: false,
              error: `Image dimensions too large. Maximum: ${this.MAX_DIMENSIONS.width}x${this.MAX_DIMENSIONS.height}`
            });
            return;
          }

          // Try to render to canvas to validate image data
          canvas.width = Math.min(img.width, 100);
          canvas.height = Math.min(img.height, 100);
          
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            // If we get here, the image is valid
            resolve({
              isValid: true,
              dimensions: { width: img.width, height: img.height },
              size: file.size,
              format: file.type
            });
          } else {
            resolve({
              isValid: false,
              error: 'Unable to process image data'
            });
          }
        } catch (error) {
          resolve({
            isValid: false,
            error: 'Corrupted or invalid image data'
          });
        }
      };

      img.onerror = () => {
        resolve({
          isValid: false,
          error: 'Corrupted or invalid image file'
        });
      };

      // Create object URL for the image
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;

      // Cleanup after a timeout
      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 10000);
    });
  }

  /**
   * Convert image to a standardized format and compress if needed
   */
  static optimizeImage(
    file: File, 
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
      format?: 'jpeg' | 'png' | 'webp';
    } = {}
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const {
        maxWidth = 1920,
        maxHeight = 1080,
        quality = 0.8,
        format = 'jpeg'
      } = options;

      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      img.onload = () => {
        try {
          // Calculate new dimensions
          let { width, height } = img;
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }

          // Set canvas size
          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const optimizedFile = new File(
                  [blob], 
                  `optimized_${file.name.replace(/\.[^/.]+$/, '')}.${format}`,
                  { type: `image/${format}` }
                );
                resolve(optimizedFile);
              } else {
                reject(new Error('Failed to optimize image'));
              }
            },
            `image/${format}`,
            quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for optimization'));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Create a thumbnail from an image file
   */
  static createThumbnail(file: File, size: number = 150): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      img.onload = () => {
        try {
          // Calculate square crop
          const minDimension = Math.min(img.width, img.height);
          const x = (img.width - minDimension) / 2;
          const y = (img.height - minDimension) / 2;

          canvas.width = size;
          canvas.height = size;

          // Draw cropped and resized image
          ctx.drawImage(
            img,
            x, y, minDimension, minDimension,
            0, 0, size, size
          );

          resolve(canvas.toDataURL('image/jpeg', 0.8));
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for thumbnail'));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Check if a URL points to a valid image
   */
  static validateImageUrl(url: string): Promise<ImageValidationResult> {
    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({
          isValid: true,
          dimensions: { width: img.width, height: img.height }
        });
      };

      img.onerror = () => {
        resolve({
          isValid: false,
          error: 'Unable to load image from URL'
        });
      };

      // Set a timeout for the request
      const timeout = setTimeout(() => {
        resolve({
          isValid: false,
          error: 'Image loading timeout'
        });
      }, 10000);

      img.onload = () => {
        clearTimeout(timeout);
        resolve({
          isValid: true,
          dimensions: { width: img.width, height: img.height }
        });
      };

      img.src = url;
    });
  }

  /**
   * Generate a placeholder image with text
   */
  static generatePlaceholder(
    width: number = 400,
    height: number = 300,
    text: string = 'Image',
    backgroundColor: string = '#000000',
    textColor: string = '#ffffff'
  ): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return '';
    }

    canvas.width = width;
    canvas.height = height;

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Add text
    ctx.fillStyle = textColor;
    ctx.font = `${Math.min(width, height) / 8}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);

    return canvas.toDataURL('image/png');
  }
}

export default ImageHandler;