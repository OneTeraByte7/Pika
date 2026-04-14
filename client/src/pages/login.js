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
        <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
            <h1 className="text-2xl mb-4">Login</h1>
            <form onSubmit={handleSubmit}>
                <label className="block mb-2">
                    Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" required />
                </label>
                <label className="block mb-2">
                    Password
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" required />
                </label>
                {error && <div className="text-red-600 mb-2">{error}</div>}
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Sign in</button>
            </form>
            <div className="mt-4">
                Don't have an account? <a href="/register" className="text-blue-600">Register</a>
            </div>
        </div>
    )
}
