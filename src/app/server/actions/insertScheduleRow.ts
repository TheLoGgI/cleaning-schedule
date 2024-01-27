"use server"

import { Role } from "@/app/components/EnumRole"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"
import { Tables } from "@/app/helpers/tables"

// import { useRouter } from 'next/router'

export async function insertScheduleRow(formData: FormData) {
  const scheduleId = String(formData.get("scheduleId"))
  const weekNr = Number(formData.get("weekNr"))
  const cleaner1 = String(formData.get("cleaner1"))
  const cleaner2 = String(formData.get("cleaner2"))

  const supabase = createServerComponentClient({ cookies })

  const authId = (await supabase.auth.getSession()).data.session?.user.id

  try {
    const role = await supabase
      .from("ScheduleRole")
      .select("role")
      .match({
        scheduleId: scheduleId,
        authId: authId,
      })
      .single()

    if (
      !(role.data?.role === Role.Admin || role.data?.role === Role.Moderator)
    ) {
      throw new Error(
        `User authId('${authId}') tried to insert ScheduleRow(${scheduleId}), but was not allowed`
      )
    }

    const insertedScheduleRow = await supabase
      .from(Tables.ScheduleRow)
      .insert([
        {
          weekNr,
          scheduleId,
          room: cleaner1,
        },
        {
          weekNr,
          scheduleId,
          room: cleaner2,
        },
      ])
      .select()

    if (insertedScheduleRow.error) {
      throw new Error(
        "Could not insert new ScheduleRow: " +
          JSON.stringify(insertedScheduleRow.error)
      )
    }

    revalidatePath("/dashboard", "page")
  } catch (error) {
    console.warn(error)
  }
}
