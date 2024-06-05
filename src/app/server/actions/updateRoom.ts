"use server"

import { revalidatePath, revalidateTag } from "next/cache"

import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

type UpdateRoomSelect = {
  data: {
    userId: string
    User: { firstName: string; lastName: string }
  }
}

export async function updateRoom(formData: FormData) {
  const roomId = formData.get("roomId")
  // TODO: better error handling
  
  if (!roomId) throw new Error("id is required")
    const scheduleId = formData.get("scheduleId")
    const inCleaningSchedule = formData.get("inCleaningSchedule")
    const roomNr = formData.get("roomNr")

  const supabase = createServerComponentClient({ cookies })
  // try {
  const updatedRoom = (await supabase
    .from("Room")
    .update({
      roomNr,
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
    .eq("id", updatedRoom.data.userId)
  }

  revalidateTag("rooms")
  revalidatePath(`/schedule/[slug]`, "page")
}
