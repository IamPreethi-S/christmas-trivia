import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Christmas Movie Trivia',
  description: 'Join the festive fun with Christmas movie trivia!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

