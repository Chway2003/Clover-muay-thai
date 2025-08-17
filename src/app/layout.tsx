import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Clover Muay Thai - Master the Art of Muay Thai',
  description: 'Join Clover Muay Thai for professional training in authentic Muay Thai. From beginners to advanced fighters, discover your potential in our supportive environment.',
  keywords: 'Muay Thai, martial arts, training, fitness, self-defense, Clover Muay Thai, boxing, kickboxing, martial arts gym',
  authors: [{ name: 'Clover Muay Thai' }],
  metadataBase: new URL('https://mydomain.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Clover Muay Thai - Master the Art of Muay Thai',
    description: 'Professional Muay Thai training in a supportive environment',
    url: 'https://mydomain.com',
    siteName: 'Clover Muay Thai',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/clovermya.jpg',
        width: 1200,
        height: 630,
        alt: 'Clover Muay Thai Training',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clover Muay Thai - Master the Art of Muay Thai',
    description: 'Professional Muay Thai training in a supportive environment',
    images: ['/clovermya.jpg'],
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
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
