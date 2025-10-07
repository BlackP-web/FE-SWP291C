'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token')
        const provider = searchParams.get('provider')
        const error = searchParams.get('error')

        console.log('Callback params:', { token, provider, error })

        if (error) {
          setError(`Đăng nhập thất bại: ${error}`)
          setTimeout(() => router.push('/login'), 3000)
          return
        }

        if (!token) {
          setError('Token không hợp lệ')
          setTimeout(() => router.push('/login'), 3000)
          return
        }

        // Store token and user info
        localStorage.setItem('token', token)
        
        // Create user info based on provider or default
        const providerName = provider || 'Social'
        const mockUser = {
          id: Date.now().toString(),
          name: `${providerName} User`,
          email: `${providerName.toLowerCase()}@example.com`,
          role: 'user',
          provider: providerName
        }
        
        localStorage.setItem('user', JSON.stringify(mockUser))

        console.log(`${providerName} login successful`)
        
        // Redirect to home
        router.push('/')
      } catch (err) {
        console.error('Callback error:', err)
        setError('Có lỗi xảy ra')
        setTimeout(() => router.push('/login'), 3000)
      } finally {
        setLoading(false)
      }
    }

    handleCallback()
  }, [router, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tesla-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tesla-black mx-auto mb-4"></div>
          <p className="text-tesla-body text-gray-600">Đang xử lý đăng nhập...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tesla-white">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-light text-tesla-black mb-4">Đăng nhập thất bại</h1>
          <p className="text-tesla-body text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-tesla-black text-tesla-white px-6 py-3 rounded-xl hover:bg-tesla-dark-gray transition-colors"
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    )
  }

  return null
}
