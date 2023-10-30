"use server"

import { revalidatePath, revalidateTag } from "next/cache"

import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

type UpdateRoomSelect = {
  data: {
    userID: string
    User: { firstName: string; lastName: string }
  }
}

export async function updateRoom(formData: FormData) {
  console.log("formData: ", formData)

  const roomId = formData.get("roomId")
  const scheduleId = formData.get("scheduleId")
  const inCleaningSchedule = formData.get("inCleaningSchedule")
  // TODO: better error handling

  if (!roomId) throw new Error("id is required")

  const supabase = createServerComponentClient({ cookies })
  // try {
  const updatedRoom = (await supabase
    .from("Room")
    .update({
      roomNr: formData.get("roomNr"),
      activeInSchedule: inCleaningSchedule !== null ? true : false,
    })
    .match({ id: roomId, scheduleID: scheduleId })
    .select(`userId, User(firstName, lastName)`)
    .single()) as UpdateRoomSelect

  const roomUser = updatedRoom.data.User

  if (
    roomUser.firstName !== formData.get("firstName") ||
    roomUser.lastName !== formData.get("lastName")
  ) {
    const updateRoomUser = await supabase
      .from("User")
      .update({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
      })
      .eq("id", updatedRoom.data.userID)
  }

  revalidateTag("rooms")
  revalidatePath(`/schedule/${scheduleId}`)
  // } catch (error) {
  //   console.log('error: ', error)
  // }
}