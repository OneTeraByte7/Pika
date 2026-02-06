import httpx
from typing import Optional
import base64
from config.settings import settings

class VoiceService:
    def __init__(self):
        self.api.key = settings.ELEVENLABS_API_KEY
        self.voice.id = "21m00Tcm4TlvDq8ikWAM"
        self.base_url = "https://api.elevenlabs.io/v1"
        
    async def text_to_speech(self, text: str) -> Optional[bytes]:
        if not self.api_key:
            return None
        
        url = f"{self.base_url}/text-to_speech/{self.voice_id}"
        
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": self.api_key
        }
        
        data = {
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75,
                "style": 0.5,
                "use_speaker_boost": True 
            }
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=data, header = headers, timeout = 30.0)
                
                if response.status_code == 200:
                    return response.content
                else:
                    print(f"ElevenLabs API error: {response.status_code}")
                    return None
                
        except Exception as e:
            print(f"Error generating speech: {e}")
            return None
        
        
    def speech_to_text(self, audio_data: str) -> Optional[str]:
        pass
    
    async def get_aufio_url(self, text: str) -> Optional[str]:
        audio_bytes = await self.text_to_speech(text)
        
        if audio_bytes:
            audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
            return f"data:audio/mpeg;base64,{audio_base64}"
        
        return None