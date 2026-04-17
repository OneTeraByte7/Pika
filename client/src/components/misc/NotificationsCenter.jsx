import React from 'react';

export default function NotificationsCenter() {
    return (
        <div className="p-4 bg-white/5 rounded-2xl">
            <h3 className="font-bold">Notifications</h3>
            <ul className="mt-2 space-y-2 text-sm text-white/50">
                <li>New comment on your post</li>
                <li>Account connected: Twitter</li>
                <li>Weekly digest ready</li>
            </ul>
        </div>
    );
}
