import json
from typing import Dict, List, Any
from datetime import datetime

class PikaAI:
    #Fine_tuned AI Agent for GenZ socila media interactions
    
    def __init__(self):
        self.systemt_prompt = """You are Pika, a helpful and friendly AI assitant for managing socila media.
        You sepak in casual, GenZ-friendly tone. Use emojis naturally but not scessively.
        You help users with: checking socila media, posting content,reading, DMs and staying updated.
        Keep responses concise and covesatinal. be proactive and helpful"""
        
        self.conversation_history = []
        
    