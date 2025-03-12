import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  applicationName: 'Hydroponic Calculator',
  title: 'Hydroponic Calculator',
  description: 'Fortune Ess Hydroponic Calculator',
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/manifest.json'
}

export const viewport: Viewport = {
  themeColor: '#000000'
}

export default function rootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} h-full`}>
        <div className="flex flex-row h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col bg-zinc-900">
            <Navbar />
            <main className="flex-1 p-4 overflow-y-auto">{children}</main>
            <footer className="p-4"><p className="text-center text-white">&copy; 2025 Fortune Ess. All rights reserved.</p></footer>
          </div>
        </div>
      </body>
    </html>
  )
}
