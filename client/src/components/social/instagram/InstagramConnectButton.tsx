export default function InstagramConnectButton({ onConnect }: { onConnect?: () => void }) {
    return (
        <button onClick={onConnect} className="px-4 py-2 bg-gradient-pika text-white rounded-2xl">Connect Instagram</button>
    );
}
