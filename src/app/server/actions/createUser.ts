"use server"

import { db } from "@/lib/db"
import { user, inviteKey, room } from "@/lib/schema"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

/**
 * Creates a new local user (no authentication).
 * Optionally validates an invite code and assigns the user to a schedule room.
 */
export async function createUser(prevState: any, formData: FormData) {
  const firstName = String(formData.get("first-name"))
  const lastName = formData.get("last-name") as string | null
  const email = formData.get("email") as string | null

  // Optional invite flow
  const scheduleId = formData.get("scheduleId") as string | null
  const code = formData.get("inviteCode") as string | null
  const hasInvite = scheduleId !== null && code !== null

  if (!firstName) return { error: "First name is required" }

  // Validate invite code if provided
  if (hasInvite) {
    const [existingKey] = await db
      .select()
      .from(inviteKey)
      .where(and(eq(inviteKey.key, code!), eq(inviteKey.scheduleId, scheduleId!)))
      .limit(1)

    if (!existingKey) {
      return { error: "Invalid invitation code" }
    }
  }

  const [newUser] = await db
    .insert(user)
    .values({ firstName, lastName: lastName ?? undefined, email: email ?? undefined })
    .returning({ id: user.id })

  if (!newUser) return { error: "Could not create user" }

  if (hasInvite) {
    await db.insert(room).values({
      scheduleID: scheduleId!,
      userId: newUser.id,
      activeInSchedule: false,
      roomNr: 0,
    })
  }

  revalidatePath("/dashboard", "page")
  return { message: "User created successfully", userId: newUser.id }
}
