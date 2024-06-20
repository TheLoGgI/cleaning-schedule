"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function updateUserProfile(prevState: any, formData: FormData) {


    const firstName = String(formData.get("firstName"))
    const lastName = String(formData.get("lastName"))
    const inCleaningSchedule = String(formData.get("inCleaningSchedule"))

    const supabase = createServerComponentClient({ cookies })

    const user = await supabase.auth.getUser()
    if (user.error) {
        // throw new Error("Could not find user: " + JSON.stringify(currentUser.error))
        return {
            status: 400,
            body: "Could not find user: " + JSON.stringify(user.error),
        }
    }


    // Update User
    await supabase
        .from("User")
        .update({
            firstName,
            lastName,
            notification: inCleaningSchedule === "on",
        })
        .eq("authId", user.data.user.id)
        .select()

    return {
        status: 200,
        body: "Profile updated",
    }

}