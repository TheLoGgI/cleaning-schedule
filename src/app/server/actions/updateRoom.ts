"use server"

import { db } from "@/lib/db"
import { room, user } from "@/lib/schema"
import { and, eq } from "drizzle-orm"
import { revalidatePath, revalidateTag } from "next/cache"

export async function updateRoom(formData: FormData) {
  const roomId = String(formData.get("roomId"))
  if (!roomId) throw new Error("id is required")

  const scheduleId = String(formData.get("scheduleId"))
  const inCleaningSchedule = formData.get("inCleaningSchedule")
  const roomNr = Number(formData.get("roomNr"))
  const firstName = String(formData.get("firstName"))
  const lastName = formData.get("lastName") as string | null

  const [updatedRoom] = await db
    .update(room)
    .set({
      roomNr,
      activeInSchedule: inCleaningSchedule !== null,
    })
    .where(and(eq(room.id, roomId), eq(room.scheduleID, scheduleId)))
    .returning({ userId: room.userId })

  if (updatedRoom?.userId) {
    await db
      .update(user)
      .set({ firstName, lastName: lastName ?? undefined })
      .where(eq(user.id, updatedRoom.userId))
  }

  revalidateTag("rooms")
  revalidatePath(`/schedule/[slug]`, "page")
}
