import './globals.css'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://my-resume-lite.vercel.app'),
  title: 'Venna Venkata Siva Reddy - Backend Developer | Portfolio',
  description: 'Experienced Backend Developer specializing in Node.js, Python, PostgreSQL, and React. Available for full-time opportunities.',
  keywords: [
    'backend developer',
    'software engineer',
    'Node.js developer',
    'Python developer',
    'PostgreSQL expert',
    'React developer',
    'full stack developer'
  ],
  authors: [{ name: 'Venna Venkata Siva Reddy' }],
  creator: 'Venna Venkata Siva Reddy',
  publisher: 'Venna Venkata Siva Reddy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://my-resume-lite.vercel.app',
    title: 'Venna Venkata Siva Reddy - Backend Developer | Portfolio',
    description: 'Experienced Backend Developer specializing in Node.js, Python, PostgreSQL, and React.',
    siteName: 'Venna Venkata Siva Reddy Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Venna Venkata Siva Reddy - Backend Developer | Portfolio',
    description: 'Experienced Backend Developer specializing in Node.js, Python, PostgreSQL, and React.',
    creator: '@yourusername',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
