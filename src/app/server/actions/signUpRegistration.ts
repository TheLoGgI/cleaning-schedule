"use server"

import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { getDomainUrl } from "@/app/helpers/getUrl"

export async function signUpRegistration(prevState: any, formData: FormData) {
  const email = String(formData.get("email"))
  const firstName = String(formData.get("first-name"))
  const lastName = String(formData.get("last-name"))
  const password = String(formData.get("password"))
  const repeatedPassword = String(formData.get("re-password"))

  if (!email) return { error: "Please enter email" }
  if (!firstName) return { error: "First name is required" }
  if (!password) return { error: "You need a password for your account" }
  if (!repeatedPassword) return { error: "Please repeat your password" }

  if (password !== repeatedPassword) return { error: "Passwords do not match" }
  if (password.length < 8)
    return { error: "Password must be at least 8 characters" }

  const supabase = createServerComponentClient(
    { cookies },
    {
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      options: {
        global: {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json, */*; ",
          },
        },
      },
    }
  )

  const doesUserExists = await supabase
    .from("User")
    .select()
    .eq("email", email)
    .single()

  if (doesUserExists.data !== null)
    return { error: "Sorry, could not create the user" }

  const domain = getDomainUrl()
  console.info("domain: ", domain)

  const newAuthenticatedUser = await supabase.auth.signUp({
    email,
    password,
    options: {
      // @ts-ignore
      redirectTo: `${domain}/auth/callback`,
      // emailRedirectTo: `${domain}/auth/callback`,
      data: {
        firstName,
        lastName,
        role: "User",
      },
    },
  })

  if (newAuthenticatedUser.error)
    return { error: newAuthenticatedUser.error.message }

  const createNewUser = await supabase.from("User").insert({
    firstName,
    lastName,
    email,
    authId: newAuthenticatedUser.data.user?.id,
  })

  if (createNewUser.error) return { error: createNewUser.error.message }

  return { message: "Check email to continue sign in process" }
}