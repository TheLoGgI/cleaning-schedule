import "./globals.css"

import { Analytics } from "@vercel/analytics/react"
import Header from "./components/landing/Header"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { UserContextProvider } from "./hooks/useUser"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cleaning Schedule",
  description: "Simplify Your Cleaning Routine, and Get More Done",
}

// export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const auth = await supabase.auth.getUser()
  const user = auth.data.user

  return (
    <html
      lang="en"
      // className={`
      // ${playfair.variable} ${roboto.variable}`}
    >
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
        <UserContextProvider user={user}>
          <>
            <Header />
            <main className="min-h-screen bg-background mt-10">{children}</main>
          </>
        </UserContextProvider>
        <Analytics />
      </body>
    </html>
  )
}
