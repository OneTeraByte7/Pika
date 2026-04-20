import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="w-full border-b border-white/5 py-4">
            <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="font-black text-xl">Pika</Link>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm">Login</Link>
                    <Link href="/register" className="px-4 py-2 bg-gradient-pika text-white rounded-2xl text-sm font-bold">Sign up</Link>
                </div>
            </div>
        </nav>
    );
}
