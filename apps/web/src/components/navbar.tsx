'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'

 
export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsDropdownOpen(true)
  }

  const handleAvatarLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false)
    }, 1000)
  }

  const handleDropdownLeave = () => {
    setIsDropdownOpen(false)
  }

  return (
    <nav className="shadow-md">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-16">
          {/* 天氣信息 */}
          <div className="flex items-center px-4">
            <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="ml-2 text-white">23°C 晴天</span>
          </div>

          <div className="flex items-center space-x-4">
            {/* 提醒 Icon */}
            <button className="relative p-2 text-white hover:text-gray-200">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Avatar Dropdown */}
            <div className="relative">
              <button
                className="flex items-center text-white hover:text-gray-200 focus:outline-none transition-transform duration-200 hover:scale-105"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleAvatarLeave}
              >
                <div className="w-8 h-8 rounded-full border border-white/20 bg-gray-700 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 transform transition-all duration-200 origin-top-right z-50"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    href="/main/profile"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-600 transition-colors duration-150"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/main/settings"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-600 transition-colors duration-150"
                  >
                    Settings
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600 transition-colors duration-150"
                    onClick={() => {}}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
