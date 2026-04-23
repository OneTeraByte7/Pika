import Image from 'next/image';

export default function Hero() {
    return (
        <section className="py-20">
            <div className="max-w-5xl mx-auto text-center">
                <h1 className="text-5xl font-black mb-4">Create. Schedule. Grow.</h1>
                <p className="text-lg text-white/60 mb-8">AI-powered tools to help you plan and publish better content.</p>
                <div className="flex items-center justify-center gap-4">
                    <button className="px-6 py-3 bg-gradient-pika text-white rounded-2xl font-bold">Get Started</button>
                    <button className="px-6 py-3 bg-white/5 text-white rounded-2xl">Learn More</button>
                </div>
            </div>
        </section>
    );
}
