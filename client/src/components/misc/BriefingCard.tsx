export default function BriefingCard({ title, summary }: { title: string; summary: string }) {
    return (
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <h4 className="font-bold">{title}</h4>
            <p className="text-sm text-white/50 mt-1">{summary}</p>
        </div>
    );
}
