"use server"

import { db } from "@/lib/db"
import { schedule } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function updateSchedule(formData: FormData) {
  const scheduleId = String(formData.get("scheduleId"))
  const scheduleName = String(formData.get("scheduleName"))
  const inCleaningSchedule = formData.get("inCleaningSchedule")
  const startingWeek = Number(formData.get("startingWeek"))

  await db
    .update(schedule)
    .set({
      name: scheduleName,
      startingWeek,
      isActive: inCleaningSchedule !== null,
    })
    .where(eq(schedule.id, scheduleId))

  revalidatePath("/schedule/[id]", "page")
}
