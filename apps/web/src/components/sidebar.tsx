'use client'

import { Activity, Calculator, Gauge, Headset, LayoutDashboard, Leaf, LogOut, Settings, User, Weight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeSidebar, setActiveSidebar] = useState('dashboard')
  const activeSubItemRef = useRef('')

  const menuItems = [
    {
      id: 'dashboard',
      icon: LayoutDashboard,
      link: '/dashboard',
    },
    {
      id: 'calculator',
      icon: Calculator,
      hasSubmenu: true,
      submenu: [
        { id: 'flowrate', icon: Activity, link: '/flowrate' },
        { id: 'massflow', icon: Weight, link: '/massflow' },
        { id: 'pressure', icon: Gauge, link: '/pressure' }
      ],
    },
    {
      id: 'profile',
      icon: User,
      link: '/profile',
    },
    {
      id: 'settings',
      icon: Settings,
      link: '/settings', 
    },
    {
      id: 'logout',
      icon: LogOut,
    },
  ]

  const footerNavItems = [
    { name: '設定', icon: Settings, link: '/settings' },
    { name: '聯絡我們', icon: Headset, link: '/contact' },
  ]

  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true)
    } else {
      setIsSidebarOpen(false) 
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleSubmenu = (itemId: string) => {
    setActiveSidebar(prevState => prevState === itemId ? '' : itemId)
  }

  return (
    <>
      {/* 手機版選單按鈕 */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700"
        onClick={toggleSidebar}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* 遮罩層 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className={`bg-black text-white min-h-screen flex flex-col transition-all duration-300 ease-in-out fixed lg:relative z-40 
        ${isSidebarOpen ? 'w-64' : 'w-0 -ml-64 lg:w-64 lg:ml-0'}`}>

        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6" />
            <Link href="/home" className="text-xl font-bold">Hydrogenic</Link>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.id}>
                  {item.hasSubmenu ? (
                    <button
                      onClick={() => toggleSubmenu(item.id)}
                      className={`relative flex gap-4 items-center h-[50px] w-full rounded-md font-normal text-base leading-none p-4 text-white/95 transition-all duration-300 hover:bg-white/10 hover:translate-x-1 cursor-pointer
                        ${activeSidebar === item.id ? 'bg-gray-800' : ''}`}
                    >
                      {item.icon && <item.icon className="h-5 w-5" />}
                      <p className="flex-1">{item.id}</p>
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${
                          activeSidebar === item.id ? 'rotate-180' : ''
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                  ) : (
                    <Link
                      href={item.link || '#'}
                      className={`relative flex gap-4 items-center h-[50px] w-full rounded-md font-normal text-base leading-none p-4 text-white/95 transition-all duration-300 hover:bg-white/10 hover:translate-x-1 cursor-pointer
                        ${activeSidebar === item.id ? 'bg-gray-800' : ''}`}
                      onClick={() => {
                        setActiveSidebar(item.id)
                        if (window.innerWidth < 1024) {
                          setIsSidebarOpen(false)
                        }
                      }}
                    >
                      {item.icon && <item.icon className="h-5 w-5" />}
                      <p className="flex-1">{item.id}</p>
                    </Link>
                  )}

                  {item.hasSubmenu && activeSidebar === item.id && (
                    <div className="relative overflow-hidden transition-all duration-500">
                      <ul className="grid gap-1 list-none p-2 m-0 w-full">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.id}>
                            <Link
                              href={subItem.link}
                              className={`relative pl-[52px] font-normal text-base leading-none text-white/95 transition-all duration-300 h-[42px] w-full rounded-md hover:bg-white/10 hover:translate-x-1 cursor-pointer flex items-center gap-2
                                before:content-[''] before:absolute before:top-1/2 before:left-6 before:-translate-y-1/2 before:w-[5px] before:h-[5px] before:rounded-full before:bg-white/35
                                ${activeSubItemRef.current === subItem.id ? 'bg-gray-800' : ''}`}
                              onClick={() => {
                                activeSubItemRef.current = subItem.id
                                if (window.innerWidth < 1024) {
                                  setIsSidebarOpen(false)
                                }
                              }}
                            >
                              {subItem.icon && <subItem.icon className="h-4 w-4" />}
                              {subItem.id}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-800">
          <ul className="space-y-1">
            {footerNavItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.link}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 text-white"
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setIsSidebarOpen(false)
                    }
                  }}
                >
                  {item.icon && <item.icon className="h-5 w-5" />}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
