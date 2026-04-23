export default function Modal({ children, open, onClose }: { children: React.ReactNode; open: boolean; onClose: () => void }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 z-10 max-w-2xl w-full">
                {children}
            </div>
        </div>
    );
}
