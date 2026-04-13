from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import base64

from server.services.media import MediaProcessor, MediaType

router = APIRouter(prefix="/media", tags=["media"])

processor = MediaProcessor()


class UploadRequest(BaseModel):
    file_name: str
    data_base64: Optional[str] = None
    platform: Optional[str] = None


@router.post("/upload")
async def upload_media(req: UploadRequest):
    if not req.data_base64:
        raise HTTPException(status_code=400, detail="No data provided")

    try:
        file_data = base64.b64decode(req.data_base64)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid base64 data")

    validation = processor.validate_media(file_data, req.file_name)
    metadata = processor.extract_metadata(file_data, req.file_name).to_dict()
    safety = processor.detect_inappropriate_content(file_data)

    # Determine media type for upload URL
    media_type_str = validation.get("media_type")
    try:
        media_type_enum = MediaType(media_type_str) if media_type_str else MediaType.IMAGE
    except Exception:
        media_type_enum = MediaType.IMAGE

    upload_url_info = processor.generate_upload_url(req.file_name, media_type_enum)

    return {
        "validation": validation,
        "metadata": metadata,
        "safety": safety,
        "upload": upload_url_info
    }
