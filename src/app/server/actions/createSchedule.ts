"use server"

import { db } from "@/lib/db"
import { schedule } from "@/lib/schema"
import { revalidatePath } from "next/cache"

export async function createSchedule(prevState: any, formData: FormData) {
  const scheduleName = String(formData.get("scheduleName"))
  const createdBy = String(formData.get("createdBy"))
  const startingWeek = Number(formData.get("startingWeek"))

  try {
    if (!scheduleName || !startingWeek || !createdBy) {
      return {
        status: 500,
        body: "Missing scheduleName, startingWeek or createdBy",
      }
    }

    await db.insert(schedule).values({
      name: scheduleName,
      startingWeek,
      createdBy,
    })

    revalidatePath("/dashboard", "page")
    return {
      status: 200,
      body: "Successfully created schedule",
    }
  } catch (error) {
    console.warn(error)
    return {
      status: 500,
      body: "Failed to create schedule",
    }
  }
}
