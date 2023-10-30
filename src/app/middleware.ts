import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

// TODO: Maybe have to move this to further out
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res })

  // // Refresh session if expired - required for Server Components
  // // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  await supabase.auth.getSession()

  return res
}
