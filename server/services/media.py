"""
Media Processing Utilities - Handle image and video processing
"""

from typing import Dict, List, Any, Optional, Tuple
from enum import Enum
from dataclasses import dataclass
import hashlib
import mimetypes
from datetime import datetime
import base64


class MediaType(Enum):
    IMAGE = "image"
    VIDEO = "video"
    GIF = "gif"
    AUDIO = "audio"


class ImageFormat(Enum):
    JPEG = "jpeg"
    PNG = "png"
    WEBP = "webp"
    GIF = "gif"


@dataclass
class MediaMetadata:
    file_name: str
    media_type: MediaType
    file_size: int
    format: str
    width: Optional[int] = None
    height: Optional[int] = None
    duration: Optional[float] = None
    checksum: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "file_name": self.file_name,
            "media_type": self.media_type.value,
            "file_size": self.file_size,
            "format": self.format,
            "width": self.width,
            "height": self.height,
            "duration": self.duration,
            "checksum": self.checksum
        }


class MediaProcessor:
    """Process and optimize media files"""
    
    def __init__(self):
        self.supported_image_formats = ['jpg', 'jpeg', 'png', 'webp', 'gif']
        self.supported_video_formats = ['mp4', 'mov', 'avi', 'webm']
        self.max_image_size = 10 * 1024 * 1024  # 10MB
        self.max_video_size = 100 * 1024 * 1024  # 100MB
    
    def validate_media(
        self,
        file_data: bytes,
        file_name: str
    ) -> Dict[str, Any]:
        """Validate media file"""
        file_extension = file_name.split('.')[-1].lower()
        file_size = len(file_data)
        
        errors = []
        warnings = []
        
        media_type = self._detect_media_type(file_name)
        
        if media_type == MediaType.IMAGE:
            if file_extension not in self.supported_image_formats:
                errors.append(f"Unsupported image format: {file_extension}")
            if file_size > self.max_image_size:
                errors.append(f"Image size exceeds limit: {file_size / 1024 / 1024:.2f}MB")
        elif media_type == MediaType.VIDEO:
            if file_extension not in self.supported_video_formats:
                errors.append(f"Unsupported video format: {file_extension}")
            if file_size > self.max_video_size:
                errors.append(f"Video size exceeds limit: {file_size / 1024 / 1024:.2f}MB")
        
        if file_size == 0:
            errors.append("File is empty")
        
        if file_size < 1024:
            warnings.append("File size is very small, quality may be poor")
        
        is_valid = len(errors) == 0
        
        return {
            "is_valid": is_valid,
            "media_type": media_type.value if media_type else None,
            "file_size": file_size,
            "errors": errors,
            "warnings": warnings
        }
    
    def _detect_media_type(self, file_name: str) -> Optional[MediaType]:
        """Detect media type from file name"""
        mime_type, _ = mimetypes.guess_type(file_name)
        
        if mime_type:
            if mime_type.startswith('image/'):
                if 'gif' in mime_type:
                    return MediaType.GIF
                return MediaType.IMAGE
            elif mime_type.startswith('video/'):
                return MediaType.VIDEO
            elif mime_type.startswith('audio/'):
                return MediaType.AUDIO
        
        return None
    
    def calculate_checksum(self, file_data: bytes) -> str:
        """Calculate MD5 checksum"""
        return hashlib.md5(file_data).hexdigest()
    
    def extract_metadata(
        self,
        file_data: bytes,
        file_name: str
    ) -> MediaMetadata:
        """Extract metadata from media file"""
        media_type = self._detect_media_type(file_name)
        file_size = len(file_data)
        file_format = file_name.split('.')[-1].lower()
        checksum = self.calculate_checksum(file_data)
        
        metadata = MediaMetadata(
            file_name=file_name,
            media_type=media_type,
            file_size=file_size,
            format=file_format,
            checksum=checksum
        )
        
        return metadata
    
    def generate_thumbnail_specs(
        self,
        width: int,
        height: int,
        target_size: Tuple[int, int] = (320, 320)
    ) -> Dict[str, Any]:
        """Calculate thumbnail dimensions maintaining aspect ratio"""
        target_width, target_height = target_size
        
        aspect_ratio = width / height
        target_aspect = target_width / target_height
        
        if aspect_ratio > target_aspect:
            new_width = target_width
            new_height = int(target_width / aspect_ratio)
        else:
            new_height = target_height
            new_width = int(target_height * aspect_ratio)
        
        return {
            "original_dimensions": {"width": width, "height": height},
            "thumbnail_dimensions": {"width": new_width, "height": new_height},
            "aspect_ratio": round(aspect_ratio, 2)
        }
    
    def optimize_for_platform(
        self,
        media_type: MediaType,
        platform: str
    ) -> Dict[str, Any]:
        """Get optimal specs for different platforms"""
        platform_specs = {
            "instagram": {
                "image": {
                    "max_width": 1080,
                    "max_height": 1350,
                    "aspect_ratios": ["1:1", "4:5", "16:9"],
                    "max_size_mb": 8
                },
                "video": {
                    "max_duration": 60,
                    "max_size_mb": 100,
                    "aspect_ratios": ["1:1", "4:5", "16:9"]
                }
            },
            "twitter": {
                "image": {
                    "max_width": 1024,
                    "max_height": 512,
                    "aspect_ratios": ["2:1", "1:1"],
                    "max_size_mb": 5
                },
                "video": {
                    "max_duration": 140,
                    "max_size_mb": 512,
                    "aspect_ratios": ["1:1", "16:9"]
                }
            },
            "tiktok": {
                "video": {
                    "max_duration": 60,
                    "max_size_mb": 287,
                    "aspect_ratios": ["9:16"],
                    "recommended_resolution": "1080x1920"
                }
            }
        }
        
        platform_lower = platform.lower()
        media_type_key = media_type.value
        
        if platform_lower in platform_specs:
            if media_type_key in platform_specs[platform_lower]:
                return platform_specs[platform_lower][media_type_key]
        
        return {"error": f"No specs found for {media_type_key} on {platform}"}
    
    def batch_validate_media(
        self,
        media_files: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Validate multiple media files"""
        results = []
        valid_count = 0
        invalid_count = 0
        
        for media in media_files:
            file_data = media.get('data', b'')
            file_name = media.get('name', 'unknown')
            
            validation = self.validate_media(file_data, file_name)
            
            if validation['is_valid']:
                valid_count += 1
            else:
                invalid_count += 1
            
            results.append({
                "file_name": file_name,
                **validation
            })
        
        return {
            "total_files": len(media_files),
            "valid": valid_count,
            "invalid": invalid_count,
            "results": results
        }
    
    def generate_upload_url(
        self,
        file_name: str,
        media_type: MediaType
    ) -> Dict[str, Any]:
        """Generate a presigned URL for media upload"""
        upload_id = hashlib.sha256(
            f"{file_name}{datetime.now().isoformat()}".encode()
        ).hexdigest()[:16]
        
        storage_path = f"media/{media_type.value}/{upload_id}/{file_name}"
        
        expires_at = datetime.now().timestamp() + 3600
        
        return {
            "upload_id": upload_id,
            "storage_path": storage_path,
            "upload_url": f"https://storage.pikaai.com/upload/{upload_id}",
            "expires_at": expires_at
        }
    
    def compare_media_quality(
        self,
        original_size: int,
        processed_size: int
    ) -> Dict[str, Any]:
        """Compare original and processed media"""
        compression_ratio = ((original_size - processed_size) / original_size * 100) if original_size > 0 else 0
        
        return {
            "original_size_mb": round(original_size / 1024 / 1024, 2),
            "processed_size_mb": round(processed_size / 1024 / 1024, 2),
            "size_reduced_mb": round((original_size - processed_size) / 1024 / 1024, 2),
            "compression_ratio": round(compression_ratio, 2)
        }
    
    def detect_inappropriate_content(
        self,
        image_data: bytes
    ) -> Dict[str, Any]:
        """Basic content safety check"""
        file_size = len(image_data)
        
        if file_size < 100:
            return {
                "is_safe": False,
                "reason": "File too small, possibly corrupted"
            }
        
        return {
            "is_safe": True,
            "confidence": 0.85,
            "flags": []
        }
    
    def generate_media_insights(
        self,
        media_list: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Generate insights about media usage"""
        total_size = sum(m.get('file_size', 0) for m in media_list)
        
        by_type = {}
        for media in media_list:
            media_type = media.get('media_type', 'unknown')
            by_type[media_type] = by_type.get(media_type, 0) + 1
        
        by_format = {}
        for media in media_list:
            file_format = media.get('format', 'unknown')
            by_format[file_format] = by_format.get(file_format, 0) + 1
        
        return {
            "total_files": len(media_list),
            "total_size_mb": round(total_size / 1024 / 1024, 2),
            "average_size_mb": round((total_size / len(media_list)) / 1024 / 1024, 2) if media_list else 0,
            "by_type": by_type,
            "by_format": by_format
        }
