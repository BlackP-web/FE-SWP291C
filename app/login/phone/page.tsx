'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { ArrowLeft, Phone } from 'lucide-react'

export default function PhoneLoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'phone' | 'verify' | 'complete'>('phone')
  const [formData, setFormData] = useState({
    phone: '',
    code: '',
    name: '',
    email: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sentCode, setSentCode] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.phone) {
      setError('Vui lòng nhập số điện thoại')
      return
    }

    try {
      setLoading(true)
      console.log('Sending verification code to:', formData.phone)

      const res = await api.post('/auth/phone/send-code', { phone: formData.phone })
      console.log('Code sent response:', res.data)

      setSentCode(true)
      setStep('verify')
    } catch (err: any) {
      console.error('Send code error:', err)
      setError(err?.response?.data?.message || 'Không thể gửi mã xác thực')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.code) {
      setError('Vui lòng nhập mã xác thực')
      return
    }

    try {
      setLoading(true)
      console.log('Verifying code:', formData.code)

      const res = await api.post('/auth/phone/verify', {
        phone: formData.phone,
        code: formData.code
      })
      console.log('Verification response:', res.data)

      const { token, user } = res.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      // Check if user needs to complete registration
      if (user.email.includes('@temp.com')) {
        setStep('complete')
      } else {
        router.push('/')
      }
    } catch (err: any) {
      console.error('Verify code error:', err)
      setError(err?.response?.data?.message || 'Mã xác thực không đúng')
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name || !formData.email) {
      setError('Vui lòng điền đầy đủ thông tin')
      return
    }

    try {
      setLoading(true)
      console.log('Completing registration:', formData)

      const res = await api.post('/auth/phone/complete', {
        phone: formData.phone,
        name: formData.name,
        email: formData.email
      })
      console.log('Complete registration response:', res.data)

      const { token, user } = res.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      router.push('/')
    } catch (err: any) {
      console.error('Complete registration error:', err)
      setError(err?.response?.data?.message || 'Không thể hoàn tất đăng ký')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center">
            <Phone className="w-6 h-6 text-tesla-black mr-2" />
            <h1 className="text-2xl font-light text-tesla-black">
              {step === 'phone' && 'Đăng nhập bằng SĐT'}
              {step === 'verify' && 'Xác thực mã'}
              {step === 'complete' && 'Hoàn tất đăng ký'}
            </h1>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Step 1: Phone Number */}
        {step === 'phone' && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Nhập số điện thoại"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tesla-black/20 focus:border-tesla-black transition-all duration-300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-tesla-black to-tesla-dark-gray text-tesla-white py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70"
            >
              {loading ? 'Đang gửi...' : 'Gửi mã xác thực'}
            </button>

            <p className="text-center text-sm text-gray-600">
              Chúng tôi sẽ gửi mã xác thực 6 chữ số đến số điện thoại của bạn
            </p>
          </form>
        )}

        {/* Step 2: Verification Code */}
        {step === 'verify' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã xác thực
              </label>
              <input
                type="text"
                name="code"
                placeholder="Nhập mã 6 chữ số"
                value={formData.code}
                onChange={handleInputChange}
                maxLength={6}
                className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tesla-black/20 focus:border-tesla-black transition-all duration-300 text-center text-lg tracking-widest"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-tesla-black to-tesla-dark-gray text-tesla-white py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70"
            >
              {loading ? 'Đang xác thực...' : 'Xác thực'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-sm text-tesla-black hover:text-tesla-dark-gray"
              >
                Gửi lại mã
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Complete Registration */}
        {step === 'complete' && (
          <form onSubmit={handleCompleteRegistration} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
              </label>
              <input
                type="text"
                name="name"
                placeholder="Nhập họ và tên"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tesla-black/20 focus:border-tesla-black transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Nhập email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tesla-black/20 focus:border-tesla-black transition-all duration-300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-tesla-black to-tesla-dark-gray text-tesla-white py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70"
            >
              {loading ? 'Đang hoàn tất...' : 'Hoàn tất đăng ký'}
            </button>
          </form>
        )}

        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && sentCode && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-700">
              <strong>Development Mode:</strong> Mã xác thực sẽ được hiển thị trong console server
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
