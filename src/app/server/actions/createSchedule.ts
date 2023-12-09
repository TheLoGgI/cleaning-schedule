"use server"

import { Role } from "@/app/components/EnumRole"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"

// import { useRouter } from 'next/router'

export async function createSchedule(prevState: any, formData: FormData) {
  console.log("prevState: ", prevState)
  const scheduleName = String(formData.get("scheduleName"))
  const authId = String(formData.get("authId"))
  const startingWeek = Number(formData.get("startingWeek"))

  const supabase = createServerComponentClient({ cookies })

  try {
    if (!scheduleName || !startingWeek) {
      return {
        status: 500,
        body: "Missing scheduleName or startingWeek",
      }
    }

    // TODO: FIX AUTH ID
    const currentUser = await supabase
      .from("User")
      .select("*")
      .eq("authId", authId)
      .single()
    //   .eq('authId', 'd1c4923c-658b-4f1a-b310-ddcaad051af5')

    if (currentUser.error) {
      return {
        status: 500,
        body: "Could not find user: " + JSON.stringify(currentUser.error),
      }
    }

    const newSchedule = await supabase
      .from("Schedule")
      .insert({
        name: scheduleName,
        startingWeek,
        createdBy: currentUser.data.id,
      })
      .select()
      .single()

    if (newSchedule.error) {
      return {
        status: 500,
        body:
          "Could not insert new schedule: " + JSON.stringify(newSchedule.error),
      }
    }

    // if (newSchedule.error) {
    //   return NextResponse.redirect(
    //     `${requestUrl.origin}/login?error=Failed to create schedule`,
    //     {
    //       // a 301 status is required to redirect from a POST to a GET route
    //       status: 301,
    //     },
    //   )
    // }

    const scheduleRole = await supabase.from("ScheduleRole").insert({
      userId: currentUser.data.id,
      role: Role.Admin,
      scheduleId: newSchedule.data.id,
      authId,
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
