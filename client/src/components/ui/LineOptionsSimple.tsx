export default function LineOptionsSimple({ options, onSelect }: { options: string[]; onSelect: (opt: string) => void }) {
    return (
        <div className="flex gap-2">
            {options.map((opt) => (
                <button key={opt} onClick={() => onSelect(opt)} className="px-3 py-2 bg-white/5 rounded-md">{opt}</button>
            ))}
        </div>
    );
}
