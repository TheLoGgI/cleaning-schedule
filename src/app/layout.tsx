import "./globals.css"

import { Analytics } from "@vercel/analytics/react"
import Header from "./components/landing/Header"
import { Inter } from "next/font/google"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cleaning Schedule",
  description: "Simplify Your Cleaning Routine, and Get More Done",
}

export const revalidate = 0

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link rel="icon" sizes="16x16" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>

      <body className={inter.className}>
        <>
          <Header />
          <main className="min-h-screen bg-background mt-10">{children}</main>
        </>
        <Analytics />
      </body>
    </html>
  )
}
