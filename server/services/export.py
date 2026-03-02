"""
Data Export Service - Export user data in various formats
"""

from typing import Dict, List, Any, Optional
from datetime import datetime
from enum import Enum
import json
import csv
from io import StringIO


class ExportFormat(Enum):
    JSON = "json"
    CSV = "csv"
    HTML = "html"
    MARKDOWN = "markdown"


class DataExporter:
    """Export user data in multiple formats"""
    
    def __init__(self):
        self.export_history: List[Dict[str, Any]] = []
    
    def export_posts(
        self,
        posts: List[Dict[str, Any]],
        format_type: ExportFormat
    ) -> str:
        """Export posts in specified format"""
        if format_type == ExportFormat.JSON:
            return self._export_posts_json(posts)
        elif format_type == ExportFormat.CSV:
            return self._export_posts_csv(posts)
        elif format_type == ExportFormat.HTML:
            return self._export_posts_html(posts)
        elif format_type == ExportFormat.MARKDOWN:
            return self._export_posts_markdown(posts)
        else:
            raise ValueError(f"Unsupported format: {format_type}")
    
    def _export_posts_json(self, posts: List[Dict[str, Any]]) -> str:
        """Export posts as JSON"""
        export_data = {
            "export_date": datetime.now().isoformat(),
            "total_posts": len(posts),
            "posts": posts
        }
        return json.dumps(export_data, indent=2)
    
    def _export_posts_csv(self, posts: List[Dict[str, Any]]) -> str:
        """Export posts as CSV"""
        if not posts:
            return ""
        
        output = StringIO()
        
        fieldnames = ['platform', 'content', 'likes', 'comments', 'shares', 'created_at']
        writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction='ignore')
        
        writer.writeheader()
        for post in posts:
            writer.writerow({
                'platform': post.get('platform', ''),
                'content': post.get('content', ''),
                'likes': post.get('likes', 0),
                'comments': post.get('comments', 0),
                'shares': post.get('shares', 0),
                'created_at': post.get('created_at', '')
            })
        
        return output.getvalue()
    
    def _export_posts_html(self, posts: List[Dict[str, Any]]) -> str:
        """Export posts as HTML"""
        html = """
<!DOCTYPE html>
<html>
<head>
    <title>Social Media Posts Export</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .post { background: white; padding: 20px; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .post-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .platform { color: #666; font-size: 14px; }
        .content { margin: 15px 0; line-height: 1.6; }
        .stats { display: flex; gap: 20px; color: #666; font-size: 14px; }
        .stat { display: flex; align-items: center; gap: 5px; }
    </style>
</head>
<body>
    <h1>Social Media Posts Export</h1>
    <p>Total Posts: {total}</p>
    <p>Export Date: {date}</p>
"""
        
        html = html.format(
            total=len(posts),
            date=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )
        
        for post in posts:
            post_html = f"""
    <div class="post">
        <div class="post-header">
            <span class="platform">{post.get('platform', 'Unknown')}</span>
            <span class="date">{post.get('created_at', '')}</span>
        </div>
        <div class="content">{post.get('content', '')}</div>
        <div class="stats">
            <span class="stat">❤️ {post.get('likes', 0)}</span>
            <span class="stat">💬 {post.get('comments', 0)}</span>
            <span class="stat">🔄 {post.get('shares', 0)}</span>
        </div>
    </div>
"""
            html += post_html
        
        html += """
</body>
</html>
"""
        return html
    
    def _export_posts_markdown(self, posts: List[Dict[str, Any]]) -> str:
        """Export posts as Markdown"""
        markdown = f"# Social Media Posts Export\n\n"
        markdown += f"**Total Posts:** {len(posts)}\n"
        markdown += f"**Export Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        markdown += "---\n\n"
        
        for i, post in enumerate(posts, 1):
            markdown += f"## Post {i}\n\n"
            markdown += f"**Platform:** {post.get('platform', 'Unknown')}\n"
            markdown += f"**Date:** {post.get('created_at', '')}\n\n"
            markdown += f"{post.get('content', '')}\n\n"
            markdown += f"📊 **Stats:** "
            markdown += f"❤️ {post.get('likes', 0)} | "
            markdown += f"💬 {post.get('comments', 0)} | "
            markdown += f"🔄 {post.get('shares', 0)}\n\n"
            markdown += "---\n\n"
        
        return markdown
    
    def export_analytics(
        self,
        analytics_data: Dict[str, Any],
        format_type: ExportFormat
    ) -> str:
        """Export analytics data"""
        if format_type == ExportFormat.JSON:
            return json.dumps({
                "export_date": datetime.now().isoformat(),
                "analytics": analytics_data
            }, indent=2)
        elif format_type == ExportFormat.MARKDOWN:
            return self._export_analytics_markdown(analytics_data)
        else:
            return json.dumps(analytics_data, indent=2)
    
    def _export_analytics_markdown(self, analytics: Dict[str, Any]) -> str:
        """Export analytics as Markdown"""
        md = f"# Analytics Report\n\n"
        md += f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        
        for key, value in analytics.items():
            md += f"## {key.replace('_', ' ').title()}\n\n"
            
            if isinstance(value, dict):
                for sub_key, sub_value in value.items():
                    md += f"- **{sub_key.replace('_', ' ').title()}:** {sub_value}\n"
            elif isinstance(value, list):
                for item in value:
                    if isinstance(item, dict):
                        md += f"- {json.dumps(item)}\n"
                    else:
                        md += f"- {item}\n"
            else:
                md += f"{value}\n"
            
            md += "\n"
        
        return md
    
    def export_user_data(
        self,
        user_id: int,
        user_data: Dict[str, Any],
        posts: List[Dict[str, Any]],
        format_type: ExportFormat
    ) -> str:
        """Export complete user data"""
        complete_data = {
            "user_id": user_id,
            "export_date": datetime.now().isoformat(),
            "user_info": user_data,
            "posts": posts,
            "post_count": len(posts)
        }
        
        if format_type == ExportFormat.JSON:
            return json.dumps(complete_data, indent=2)
        elif format_type == ExportFormat.MARKDOWN:
            md = f"# User Data Export\n\n"
            md += f"**User ID:** {user_id}\n"
            md += f"**Export Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
            md += "## User Information\n\n"
            for key, value in user_data.items():
                md += f"- **{key}:** {value}\n"
            md += f"\n## Posts ({len(posts)})\n\n"
            md += self._export_posts_markdown(posts)
            return md
        else:
            return json.dumps(complete_data, indent=2)
    
    def export_conversations(
        self,
        conversations: List[Dict[str, Any]],
        format_type: ExportFormat
    ) -> str:
        """Export conversation history"""
        if format_type == ExportFormat.JSON:
            return json.dumps({
                "export_date": datetime.now().isoformat(),
                "total_conversations": len(conversations),
                "conversations": conversations
            }, indent=2)
        elif format_type == ExportFormat.MARKDOWN:
            md = f"# Conversation Export\n\n"
            md += f"**Total Conversations:** {len(conversations)}\n\n"
            
            for i, conv in enumerate(conversations, 1):
                md += f"## Conversation {i}\n\n"
                md += f"**Date:** {conv.get('created_at', '')}\n\n"
                
                messages = conv.get('messages', [])
                for msg in messages:
                    role = msg.get('role', 'user')
                    content = msg.get('content', '')
                    md += f"**{role.capitalize()}:** {content}\n\n"
                
                md += "---\n\n"
            
            return md
        else:
            return json.dumps(conversations, indent=2)
    
    def create_backup(
        self,
        user_id: int,
        data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Create complete data backup"""
        backup_id = f"backup_{user_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        backup = {
            "backup_id": backup_id,
            "user_id": user_id,
            "timestamp": datetime.now().isoformat(),
            "data": data
        }
        
        self.export_history.append({
            "backup_id": backup_id,
            "user_id": user_id,
            "timestamp": datetime.now().isoformat(),
            "size_bytes": len(json.dumps(backup))
        })
        
        return backup
    
    def get_export_history(
        self,
        user_id: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """Get export history"""
        if user_id:
            return [
                entry for entry in self.export_history
                if entry['user_id'] == user_id
            ]
        return self.export_history
    
    def generate_gdpr_export(
        self,
        user_id: int,
        all_user_data: Dict[str, Any]
    ) -> str:
        """Generate GDPR-compliant data export"""
        gdpr_data = {
            "data_subject": {
                "user_id": user_id,
                "export_date": datetime.now().isoformat(),
                "purpose": "GDPR Data Subject Access Request"
            },
            "personal_data": all_user_data.get('profile', {}),
            "usage_data": {
                "posts": all_user_data.get('posts', []),
                "conversations": all_user_data.get('conversations', []),
                "activities": all_user_data.get('activities', [])
            },
            "social_connections": all_user_data.get('connections', {}),
            "preferences": all_user_data.get('preferences', {}),
            "data_retention": {
                "notice": "Your data is retained according to our privacy policy",
                "retention_period": "As per service agreement"
            }
        }
        
        return json.dumps(gdpr_data, indent=2)
