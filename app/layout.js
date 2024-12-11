import { Inter } from 'next/font/google'
import { Provider } from './provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Zinger Loserboard',
  description: 'Zinger Fantasy Football 2024   Loserboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}><Provider>{children}</Provider></body>
    </html>
  )
}
