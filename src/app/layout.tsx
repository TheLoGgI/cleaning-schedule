import "./globals.css"

import { Analytics } from "@vercel/analytics/react"
import Header from "./components/landing/Header"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export const dynamic = "force-dynamic"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Right now the Header it self can't handle this request because on build the error:
  // "Dynamic server usage: Page couldn't be rendered statically because it used `cookies`"
  // prevents the build from completing.

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
        <Header user={user} />
        <main className="min-h-screen bg-background">{children}</main>
        <Analytics />
      </body>
    </html>
  )
}
