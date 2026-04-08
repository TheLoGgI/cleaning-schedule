"use server"

import { db } from "@/lib/db"
import { inviteKey } from "@/lib/schema"
import { eq } from "drizzle-orm"

export const generateInviteCode = async (
  scheduleId: string
): Promise<string | null> => {
  const generatedCode = Math.random().toString(36).substring(2, 15)

  try {
    await db.insert(inviteKey).values({ scheduleId, key: generatedCode })
    return generatedCode
  } catch {
    // If insert fails (e.g. duplicate key), return the existing key for this schedule
    const existing = await db
      .select({ key: inviteKey.key })
      .from(inviteKey)
      .where(eq(inviteKey.scheduleId, scheduleId))
      .limit(1)

    return existing[0]?.key ?? null
  }
}
