"use server"

import { db } from "@/lib/db"
import { scheduleRow } from "@/lib/schema"
import { revalidatePath } from "next/cache"

export async function insertScheduleRow(formData: FormData) {
  const scheduleId = String(formData.get("scheduleId"))
  const weekNr = Number(formData.get("weekNr"))
  const cleaner1 = String(formData.get("cleaner1"))
  const cleaner2 = String(formData.get("cleaner2"))

  try {
    await db.insert(scheduleRow).values([
      { weekNr, scheduleId, room: cleaner1 },
      { weekNr, scheduleId, room: cleaner2 },
    ])

    revalidatePath("/dashboard", "page")
  } catch (error) {
    console.warn(error)
  }
}
