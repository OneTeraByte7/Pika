export default function LoadingSpinner({ size = 6 }: { size?: number }) {
    return (
        <div className="flex items-center justify-center">
            <div className={`w-${size} h-${size} border-2 border-white/10 rounded-full border-t-white animate-spin`} />
        </div>
    );
}
