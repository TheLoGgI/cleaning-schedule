"use server"

import { db } from "@/lib/db"
import { room } from "@/lib/schema"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function deleteRoom(formData: FormData) {
  const scheduleId = String(formData.get("scheduleId"))
  const roomId = String(formData.get("roomId"))

  try {
    await db
      .delete(room)
      .where(and(eq(room.id, roomId), eq(room.scheduleID, scheduleId)))

    revalidatePath("/schedule/[id]", "page")
  } catch (error) {
    console.warn("error: ", error)
  }
}
