"use server"

import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"

// import { useRouter } from 'next/router'

enum Role {
  User = 3,
  Moderator = 2,
  Admin = 3,
}

export async function updateSchedule(formData: FormData) {
  const scheduleId = String(formData.get("scheduleId"))
  const authId = String(formData.get("authId"))

  const scheduleName = String(formData.get("scheduleName"))
  const inCleaningSchedule = Number(formData.get("inCleaningSchedule"))
  const startingWeek = Number(formData.get("startingWeek"))

  const supabase = createServerComponentClient({ cookies })

  // TODO: Replace with AuthId
  const currentUser = await supabase
    .from("User")
    .select("*")
    .eq("authId", authId)
    .single()
  console.log("currentUser: ", currentUser)

  if (currentUser.error) {
    throw new Error("Could not find user: " + JSON.stringify(currentUser.error))
  }

  const scheduleRole = await supabase
    .from("ScheduleRole")
    .select("*")
    .match({
      userId: currentUser.data.id,
      role: Role.Admin,
      scheduleId: scheduleId,
    })
    .single()

  console.log("scheduleRole: ", scheduleRole)

  if (scheduleRole.error) {
    throw new Error(
      `User '${currentUser.data.id}' tried to update Schedule(${scheduleId}), but was not allowed` +
        JSON.stringify(currentUser.error)
    )
  }

  const updatedSchedule = await supabase
    .from("Schedule")
    .update({
      name: scheduleName,
      startingWeek,
      isActive: inCleaningSchedule !== null ? true : false,
    })
    .eq("id", scheduleId)
    .select()
  console.log("updatedSchedule: ", updatedSchedule)
  //     .select()
  //     .single()

  //   if (newSchedule.error) {
  //     throw new Error('Could not insert new schedule: ' + JSON.stringify(newSchedule.error))
  //   }

  //   // if (newSchedule.error) {
  //   //   return NextResponse.redirect(
  //   //     `${requestUrl.origin}/login?error=Failed to create schedule`,
  //   //     {
  //   //       // a 301 status is required to redirect from a POST to a GET route
  //   //       status: 301,
  //   //     },
  //   //   )
  //   // }

  revalidatePath("/schedule/[id]", "page")
  // } catch (error) {
  //   console.log(error)
  //   // return redirect(
  //   //   `${requestUrl.origin}/login?error=Failed to create schedule`,
  //   //   {
  //   //     // a 301 status is required to redirect from a POST to a GET route
  //   //     status: 301,
  //   //   },
  //   // )
  // }
}
