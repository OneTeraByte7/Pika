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
        <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
            <h1 className="text-2xl mb-4">Register</h1>
            <form onSubmit={handleSubmit}>
                <label className="block mb-2">
                    Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" required />
                </label>
                <label className="block mb-2">
                    Username
                    <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 border rounded" required />
                </label>
                <label className="block mb-2">
                    Full name
                    <input value={fullname} onChange={(e) => setFullname(e.target.value)} className="w-full p-2 border rounded" />
                </label>
                <label className="block mb-2">
                    Password
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" required />
                </label>
                {error && <div className="text-red-600 mb-2">{error}</div>}
                {success && <div className="text-green-600 mb-2">{success}</div>}
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Create account</button>
            </form>
            <div className="mt-4">
                Already have an account? <a href="/login" className="text-blue-600">Sign in</a>
            </div>
        </div>
    )
}
