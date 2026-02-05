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
        
    def process_query(self, user_input: str, context:Dict[str, Any]) -> Dict[str, Any]:
        #Process user voice or text
        
        user_input_lower = user_input.lower() 
        
        if any(word in user_input_lower for word in ["what's up", "whats up", "what up", "sup", "briefing"]):
            return self._hadle_breifing(context)
        
        elif any(word in user_input_lower for word in ["post", "share", "upload"]):
            return self._handle_post(user_input, context)
        
        elif any(word in user_input_lower for word in ["dm", "message", "messages"]):
            return self._handle_dm_inetnet(user_input, context)
        
        elif any(word in user_input_lower for word in ["check", "look", " see", "show"]):
            return self._handle_check_intent(user_input, context)
        
        elif "comment" in user_input_lower:
            return self._handle_comment_intent(user_input, context)
        
        else:
            return self._handle_general_query(user_input, context)
        
        