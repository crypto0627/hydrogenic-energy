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

const APP_NAME = "Hydroponic Calculator";
const APP_DEFAULT_TITLE = "Hydroponic Calculator";
const APP_TITLE_TEMPLATE = "%s - Hydroponic Calculator";
const APP_DESCRIPTION = "Fortune Ess Hydroponic Calculator";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  icons: {
    icon: '/fortune-ess.ico',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
  userScalable: false,
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
