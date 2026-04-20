export default function ResponseDisplay({ text }: { text: string }) {
    return (
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <p className="text-white/80">{text}</p>
        </div>
    );
}
