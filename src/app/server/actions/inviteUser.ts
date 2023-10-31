"use server"

import { revalidatePath, revalidateTag } from "next/cache"

import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

// type UpdateRoomActionProps = FormDataEntryValue

// type UpdateRoomSelect = {
//   data: {
//     userID: string
//     User: { firstName: string; lastName: string }
//   }
// }

export async function inviteUser(formData: FormData) {
  const userId = String(formData.get("userId"))
  const email = String(formData.get("email"))
  // TODO: better error handling

  if (!email) throw new Error("email is required")

  const supabase = createServerComponentClient(
    { cookies },
    {
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      options: {
        global: {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json, */*; ",
          },
        },
      },
    }
  )

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email)
  console.log("data: ", data)
  console.log("error: ", error)

  // TODO: Need more testing
  // 422 - A user with this email address has already been registered
  if (error?.status === 422) {
    const alreadyCreatedUser = await supabase
      .from("User")
      .select("id")
      .eq("email", email)
      .single()
    console.log("alreadyCreatedUser: ", alreadyCreatedUser)

    if (alreadyCreatedUser.error)
      throw new Error(alreadyCreatedUser.error.message)

    const alreadyCreatedUpdatedUser = await supabase
      .from("Room")
      .update({
        userId: alreadyCreatedUser.data?.id,
      })
      .eq("userId", userId)
      .select()
      .explain()
    console.log("alreadyCreatedUpdatedUser: ", alreadyCreatedUpdatedUser)

    const wasUserDeleted = await supabase
      .from("User")
      .delete()
      .eq("id", userId)
      .explain()

    console.log("wasUserDeleted: ", wasUserDeleted)
    return
  }

  //   // try {
  //   console.log('roomId: ', roomId)
  const updatedUser = await supabase
    .from("User")
    .update({
      authId: data.user?.id,
      email: data.user?.email,
    })
    .match({ id: userId })
  // .select(`userID, User(firstName, lastName)`)
  console.log("updatedUser: ", updatedUser)

  //   const roomUser = updatedRoom.data.User

  //   revalidateTag('rooms')
  //   revalidatePath(`/schedule/${scheduleId}`)
  // } catch (error) {
  //   console.log('error: ', error)
  // }
}
