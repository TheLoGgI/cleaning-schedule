"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function updateUserPassword(prevState: any, formData: FormData) {

    const newPassword = String(formData.get("new-password"))
    const confirmed = String(formData.get("confirm-password"))
    
    if (newPassword !== confirmed) {
        return {
            status: 400,
            body: "Passwords do not match",
        }
    }
    
    const supabase = createServerComponentClient({ cookies })

    const updatedUser = await supabase.auth.updateUser({
        password: newPassword,
    })

    if (updatedUser.error) {
        return {
            status: 400,
            body: "Choose a stronger password",
        }
    
    }
    console.log('updatedUser: ', updatedUser);

        return {
            status: 200,
            body: "User password updated",
        }
    
}