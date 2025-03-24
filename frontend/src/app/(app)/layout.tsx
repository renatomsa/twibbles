import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <head>
        <title>Twibbles</title>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
