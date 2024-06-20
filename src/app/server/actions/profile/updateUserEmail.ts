"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function updateUserEmail(prevState: any, formData: FormData) {


    const email = String(formData.get("email"))

    console.log('email: ', email);

    await new Promise((resolve) => {
        setTimeout(() => {
            console.log('timeout');
            resolve("Timeout")
        }, 1000);
    })
    
    const supabase = createServerComponentClient({ cookies })
    

    const user = await supabase.auth.getUser()
    
    if (user.error) {
        // throw new Error("Could not find user: " + JSON.stringify(currentUser.error))
        return {
            status: 400,
            body: "Could not find user: " + JSON.stringify(user.error),
        }
    }

    await supabase.auth.admin.updateUserById(user.data.user.id, {
        email
    })
    
    // Update User
    await supabase
        .from("User")
        .update({
        email,
        })
        .eq("authId", user.data.user.id)
        .select()

        // revalidatePath("/profile", "page")

        return {
            status: 200,
            body: "User email updated",
        }
    
}