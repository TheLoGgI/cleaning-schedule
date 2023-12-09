"use server"

import { Role } from "@/app/components/EnumRole"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"

export async function deleteScheduleAction(prevState: any, formData: FormData) {
  const scheduleId = formData.get("scheduleId")
  const authId = formData.get("authId")

  const supabase = createServerComponentClient({ cookies })

  const scheduleRole = await supabase
    .from("ScheduleRole")
    .select("role")
    .match({
      scheduleId: scheduleId,
      authId: authId,
    })
    .single()

  const userRole = scheduleRole.data ? scheduleRole.data?.role : Role.User
  const isAdmin = userRole === Role.Admin

  if (!isAdmin) {
    throw new Error(
      `User authId('${authId}') tried to delete Schedule(${scheduleId}), but was not allowed`
    )
  }

  try {
    await supabase.from("Schedule").delete().match({ id: scheduleId })

    revalidatePath("/dashboard", "page")
  } catch (error) {
    // throw new Error("error: can't delete room")
    console.warn("error: ", error)
  }
}
