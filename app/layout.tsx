import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Venna Venkata Siva Reddy - Software Engineer',
  description: 'Software Engineer at Cisco Systems specializing in cloud-native development, Kubernetes, and full-stack applications.',
  keywords: 'Software Engineer, Kubernetes, Java, React, Cloud, DevOps, Cisco',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-black text-white antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
