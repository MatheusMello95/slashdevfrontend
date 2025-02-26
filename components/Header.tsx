'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { useState, useEffect } from 'react'

export const Header = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in by looking for token
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    router.push('/login')
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href={isLoggedIn ? '/dashboard' : '/'} className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          SlashDev Dashboard
        </Link>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          ) : (
            <div className="flex space-x-2">
              <Link 
                href="/login" 
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  pathname === '/login' 
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  pathname === '/register' 
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}