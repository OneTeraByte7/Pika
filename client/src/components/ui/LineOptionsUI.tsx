import LineOptionsSimple from './LineOptionsSimple';

export default function LineOptionsUI({ options, onSelect }: { options: string[]; onSelect: (opt: string) => void }) {
    return (
        <div>
            <LineOptionsSimple options={options} onSelect={onSelect} />
        </div>
    );
}
