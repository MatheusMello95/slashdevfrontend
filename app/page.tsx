'use client'

import { Header } from '@/components/Header'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiHome, FiUsers, FiLayers, FiShield } from 'react-icons/fi'

export default function HomePage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
    
    // If logged in, redirect to dashboard
    if (token) {
      router.push('/dashboard')
    } else {
      setIsLoading(false)
    }
  }, [router])
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Welcome to SlashDev Dashboard
            </h1>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Manage your widgets and monitor your profile all in one place. 
              Log in to access your dashboard or create a new account.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/login" 
                className="px-6 py-3 text-base font-medium rounded-md bg-white text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg"
              >
                Log In
              </Link>
              <Link 
                href="/register" 
                className="px-6 py-3 text-base font-medium rounded-md border border-white text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register
              </Link>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Key Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="text-indigo-600 dark:text-indigo-400 mb-4">
                  <FiHome size={36} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  User Dashboard
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  A comprehensive dashboard to monitor and manage all your widgets and user data.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="text-indigo-600 dark:text-indigo-400 mb-4">
                  <FiUsers size={36} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  User Management
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Simple and secure user registration and authentication system.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="text-indigo-600 dark:text-indigo-400 mb-4">
                  <FiLayers size={36} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Widget Access
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Personalized widget access based on your user profile and permissions.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="text-indigo-600 dark:text-indigo-400 mb-4">
                  <FiShield size={36} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Secure API
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Built with Laravel and Next.js using token-based authentication for security.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} SlashDev Dashboard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}