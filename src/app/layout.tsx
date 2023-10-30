import "./globals.css"

import { Analytics } from "@vercel/analytics/react"
import Header from "./components/landing/Header"
// import Header from "./components/Header"
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
    <html lang="en">
      <body className={inter.className}>
        <Header user={user} />
        <main className="min-h-screen bg-background">{children}</main>
        <Analytics />
      </body>
    </html>
  )
}
