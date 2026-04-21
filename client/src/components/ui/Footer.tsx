export default function Footer() {
    return (
        <footer className="w-full border-t border-white/5 py-10 mt-12">
            <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-black">Pika</h3>
                    <p className="text-sm text-white/40">Small team, big ideas.</p>
                </div>
                <div className="text-sm text-white/40">
                    © {new Date().getFullYear()} Pika — All rights reserved
                </div>
            </div>
        </footer>
    );
}
