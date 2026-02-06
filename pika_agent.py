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
    
    def _handle_briefing(self, context: Dict[str, Any]) -> Dict[str, Any]:
        #generates morning responses
        activities = context.get("recent_activities", [])
        dms = context.get("unread_dms", 0)
        
        response = f"Hey ! Here's what's happening:\n\n"
        
        if activities:
            top_activity = activities[0]
            response += f"{top_activity.get('summary', 'Your frined posted something new !')} \n"
            
        if dms > 0:
            response +=  f" You have {dms} unread DMs \n"
            
        response += "\n Want details on anything"
        
        return {
            "intent": "briefing",
            "response": response,
            "actions": ["fetch_activities", "fetch_dms"],
            "require_data": True        
        }
        
    def _handle_post_intent(self, user_input: str, context: Dict[str, Any]) -> Dict[str, Any]:
        #handles posting content
        return {
            "intent": "post",
            "response": "What would you like to post ? Yon can share photos, videos,!",
            "actions": ["prepare_post"],
            "requires_data": False
        }
        
    def _handle_dm_intent(self, user_input: str, context: Dict[str, Any]) -> Dict[str, Any]:
        #handle dm query
        
        return {
            "intent": "dm_check",
            "response": "Let me check your message across all platform",
            "actions": ["fetch_dms", "summarize_dms"],
            "requires_data": True
        }
        
    def _handle_check_intent(self, user_input: str, context: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "intent": "check",
            "response": "What would you like me to check for you",
            "actions": ["serach_content"],
            "requires_data": True
        }
        
    def _handle_comment_intent(self, user_input: str, context: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "intent": "comment",
            "response": "I can help you write a comment! What vibe are you going for ?",
            "requires_data": False
        }
        
    def _handle_general_query(self, user_input: str, context: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "intent": "general",
            "response": "I'm here to help wiht your socila media ! Try asking me anything",
            "actions": [],
            "requries_data": False
        }
        
    def generate_comment(self, context: str, tone: str = "friendly") -> str:
        
        if "engagement" in context.lower() or "engaged" in context.lower():
            return "OMG Congratulations ! So happy for both of you"
        
        elif "birthday" in context.lower():
            return "Happy birthday!! Hope you have an amazing day!"
        
        else :
            return "Love this !"
        
    def summarize_activities(self, activities: List[Dict[str, Any]]) -> str:
        
        if not activities:
            return "Nothing new right one, all quiet !"
        
        summary_parts = []
        for activity in activities[:3]:
            platform = activity.get("platform", "socila media")
            activity_type = activity.get("type", "activity")
            summary_parts.append(f"{activity.get('summary', 'New activity')} on {platform}")
            
        return " . ".koin(summary_parts)