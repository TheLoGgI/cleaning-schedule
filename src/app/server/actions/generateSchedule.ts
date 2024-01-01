"use server"

import {
  SupabaseClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { shuffleRooms } from "@/app/helpers/shuffleRooms"

export type ScheduleRow = {
  id: number
  room: string | null
  scheduleId: string
  weekNr: number
}

const resetSchedule = async (supabase: SupabaseClient, scheduleId: string) => {
  // Count rows in ScheduleRow for scheduleId
  const scheduleRows = await supabase
    .from("ScheduleRow")
    .select("*", { count: "exact", head: true })
    .eq("scheduleId", scheduleId)
    .eq("show", true)

  if (scheduleRows.error) {
    throw new Error("Schedule Count went wrong: " + scheduleRows.error.message)
  }

  if (scheduleRows.count == null) {
    throw new Error("Schedule Count could not be found")
  }

  // Reset all previous schedule rows // Delete all rows with scheduleId
  if ((scheduleRows.count || 0) > 0) {
    const deletedScheduleRows = await supabase
      .from("ScheduleRow")
      .delete()
      .eq("scheduleId", scheduleId)
  }
}

export async function generateSchedule(prevState: any, formData: FormData) {
  const scheduleId = String(formData.get("scheduleId"))
  const startingWeek = Number(formData.get("startingWeek"))

  const supabase = createServerComponentClient<any>({ cookies })

  await resetSchedule(supabase, scheduleId)

  // Find all rooms from schedule dashboard
  const rooms = await supabase
    .from("Room")
    .select(
      `
          id,
          activeInSchedule,
          roomNr,
          User(id, firstName, lastName, email)
          `
    )
    .match({ scheduleID: scheduleId, activeInSchedule: true })
    .order("roomNr")

  const shuffledRooms = shuffleRooms((rooms.data as unknown as Room[]) || [])

  // Create new schedule rows and insert them into the database
  const newScheduleRows: Omit<ScheduleRow, "id">[] = []
  let weekNr = startingWeek
  for (let index = 0; index < shuffledRooms.length; index += 2, weekNr++) {
    const first = shuffledRooms[index]
    const second = shuffledRooms[index + 1]

    if (first === undefined || second === undefined) {
      newScheduleRows.push(
        {
          scheduleId,
          weekNr: weekNr,
          room: first?.id ?? null,
        },
        {
          scheduleId,
          weekNr: weekNr,
          room: second?.id ?? null,
        }
      )

      // Skip the rest of the loop and continue with the next iteration
      continue
    }

    newScheduleRows.push(
      {
        scheduleId,
        weekNr: weekNr,
        room: first.id,
      },
      {
        scheduleId,
        weekNr: weekNr,
        room: second.id,
      }
    )
  }

  await supabase.from("ScheduleRow").insert(newScheduleRows)

  revalidatePath("/schedule/[id]#Schedule", "page")
}
