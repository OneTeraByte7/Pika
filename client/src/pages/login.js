import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { authAPI } from '../services/api'
import { useAuthStore } from '../store'

export default function LoginPage() {
    const router = useRouter()
    const setToken = useAuthStore((s) => s.setToken)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        try {
            const res = await authAPI.login({ email, password })
            const token = res.data?.access_token || res.data?.token || null
            if (!token) throw new Error('No token returned')

            setToken(token)
            router.push('/social-dashboard')
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Login failed')
        }
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20">
            <div className="absolute inset-0 bg-pitch-black" />
            <div className="absolute inset-0 bg-grid-glow opacity-30" />

            <div className="relative z-10 w-full max-w-md px-6">
                <div className="backdrop-blur-md bg-white/3 border border-white/10 rounded-3xl p-8 text-white">
                    <h1 className="text-3xl font-black mb-4">Sign in to Pika</h1>
                    <p className="text-sm text-white/60 mb-6">Manage your social presence with voice-first AI.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs text-white/70">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-2 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40" placeholder="you@example.com" required />
                        </div>

                        <div>
                            <label className="text-xs text-white/70">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-2 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40" placeholder="••••••••" required />
                        </div>

                        {error && <div className="text-red-400 text-sm">{error}</div>}

                        <div className="flex items-center justify-between">
                            <button type="submit" className="px-6 py-3 bg-electric-blue text-black font-black rounded-full">Sign in</button>
                            <a href="/register" className="text-sm text-white/60 hover:text-white">Create account</a>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}
