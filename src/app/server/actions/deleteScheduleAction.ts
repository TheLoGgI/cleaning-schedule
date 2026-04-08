"use server"

import { db } from "@/lib/db"
import { schedule } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function deleteScheduleAction(prevState: any, formData: FormData) {
  const scheduleId = String(formData.get("scheduleId"))

  try {
    await db.delete(schedule).where(eq(schedule.id, scheduleId))
    revalidatePath("/dashboard", "page")
  } catch (error) {
    console.warn("error: ", error)
  }
}
