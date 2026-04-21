export default function TwitterConnectButton({ onConnect }: { onConnect?: () => void }) {
    return (
        <button onClick={onConnect} className="px-4 py-2 bg-blue-500 text-white rounded-2xl">Connect Twitter</button>
    );
}
