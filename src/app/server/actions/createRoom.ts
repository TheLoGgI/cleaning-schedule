"use server"

import { db } from "@/lib/db"
import { user, room } from "@/lib/schema"
import { revalidatePath } from "next/cache"

export async function createRoom(formData: FormData) {
  const scheduleId = String(formData.get("scheduleId"))
  const roomNr = Number(formData.get("roomNr"))
  const firstName = String(formData.get("firstName"))
  const lastName = formData.get("lastName") as string | null
  const inCleaningSchedule = formData.get("inCleaningSchedule")

  try {
    const [newUser] = await db
      .insert(user)
      .values({ firstName, lastName: lastName ?? undefined })
      .returning({ id: user.id })

    await db.insert(room).values({
      scheduleID: scheduleId,
      userId: newUser.id,
      activeInSchedule: inCleaningSchedule !== null,
      roomNr,
    })
  } catch (error) {
    console.warn("error: ", error)
  }

  revalidatePath("/schedule/[id]", "page")
}
