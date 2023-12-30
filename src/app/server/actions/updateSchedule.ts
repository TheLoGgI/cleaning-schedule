"use server"

import { Role } from "@/app/components/EnumRole"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"

export async function updateSchedule(formData: FormData) {
  const scheduleId = String(formData.get("scheduleId"))
  const authId = String(formData.get("authId"))

  const scheduleName = String(formData.get("scheduleName"))
  const inCleaningSchedule = formData.get("inCleaningSchedule")
  const startingWeek = Number(formData.get("startingWeek"))

  const supabase = createServerComponentClient({ cookies })

  const currentUser = await supabase
    .from("User")
    .select("*")
    .eq("authId", authId)
    .single()

  if (currentUser.error) {
    throw new Error("Could not find user: " + JSON.stringify(currentUser.error))
  }

  // Check if user is allowed to update schedule
  const scheduleRole = await supabase
    .from("ScheduleRole")
    .select("*")
    .match({
      userId: currentUser.data.id,
      role: Role.Admin,
      scheduleId: scheduleId,
    })
    .single()

  if (scheduleRole.error) {
    throw new Error(
      `User '${currentUser.data.id}' tried to update Schedule(${scheduleId}), but was not allowed` +
        JSON.stringify(currentUser.error)
    )
  }

  // Update Schedule
  await supabase
    .from("Schedule")
    .update({
      name: scheduleName,
      startingWeek,
      isActive: inCleaningSchedule !== null ? true : false,
    })
    .eq("id", scheduleId)
    .select()

  revalidatePath("/schedule/[id]", "page")
}
