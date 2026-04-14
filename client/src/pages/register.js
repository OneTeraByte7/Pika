import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { authAPI } from '../services/api'

export default function RegisterPage() {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [fullname, setFullname] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        try {
            await authAPI.register({ email, username, password, fullname })
            setSuccess('Registered successfully — please login')
            setTimeout(() => router.push('/login'), 1200)
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Registration failed')
        }
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20">
            <div className="absolute inset-0 bg-pitch-black" />
            <div className="absolute inset-0 bg-grid-glow opacity-30" />

            <div className="relative z-10 w-full max-w-md px-6">
                <div className="backdrop-blur-md bg-white/3 border border-white/10 rounded-3xl p-8 text-white">
                    <h1 className="text-3xl font-black mb-4">Create your Pika account</h1>
                    <p className="text-sm text-white/60 mb-6">Start managing your social accounts with voice-first AI.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs text-white/70">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-2 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40" placeholder="you@example.com" required />
                        </div>

                        <div>
                            <label className="text-xs text-white/70">Username</label>
                            <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-2 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40" placeholder="your handle" required />
                        </div>

                        <div>
                            <label className="text-xs text-white/70">Full name</label>
                            <input value={fullname} onChange={(e) => setFullname(e.target.value)} className="w-full mt-2 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40" placeholder="Your full name" />
                        </div>

                        <div>
                            <label className="text-xs text-white/70">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-2 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40" placeholder="Choose a strong password" required />
                        </div>

                        {error && <div className="text-red-400 text-sm">{error}</div>}
                        {success && <div className="text-green-400 text-sm">{success}</div>}

                        <div className="flex items-center justify-between">
                            <button type="submit" className="px-6 py-3 bg-vivid-purple text-white font-black rounded-full">Create account</button>
                            <a href="/login" className="text-sm text-white/60 hover:text-white">Already registered?</a>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}
