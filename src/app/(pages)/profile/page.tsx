import Link from "next/link";

import { TabPanel, TabPanels } from "@/app/components/Tab";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import TabNav from "./TabNav";
import { Database } from "@/app/types/supabase";

import { UpdateEmailTab } from "./tabs/updateEmailTab";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { UpdatePasswordTab } from "./tabs/updatePasswordTab";
import { UpdateProfileTab } from "./tabs/updateProfileTab";
// import { useUser } from "@/app/hooks/useUser";

export type AccountUserData = {
    id: string
    firstName: string
    lastName: string
    email: string
    authId: string
    premium: boolean
    notification: boolean
  }
  

export default async function Page({
    params,
}: {
    params: { id: string }
    searchParams?: { [key: string]: string | string[] | undefined }
}) {
    const supabase = createServerComponentClient<Database>({ cookies })
    const auth = await supabase.auth.getUser()


    if (auth.data === null) {
        // User not allowed
        // TODO: add anonymisering of users in schedule (only numbers or firstNames)
        return (
            <section className="container max-w-screen-lg mx-auto py-4 px-8">
                {/* <h1 className="text-2xl font-semibold">{schedule?.name}</h1>
            <ScheduleTable scheduleId={params.id} /> */}
            </section>
        )
    }

    const currentUser = await supabase
        .from("User")
        .select(`*`)
        .eq("authId", auth.data.user?.id as string)
        .single() as PostgrestSingleResponse<AccountUserData>


    if (currentUser.data === null) {
        return (
            <section className="container max-w-screen-lg mx-auto py-4 px-8 flex flex-col items-center gap-4">
                <h1 className="text-2xl text-center mt-40 font-semibold">
                    You need to login to watch your profile
                </h1>
                <p>Login to create your own profile</p>
                <Link
                    href="/login"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Log in
                </Link>
            </section>
        )
    }

    return (<>

        <section className="container max-w-screen-lg mx-auto py-4 px-4">

            <header className="mb-8">
                <h1 className="text-2xl">
                    Profile
                </h1>
            </header>

            <TabNav >
                <TabPanels>
                    <UpdateProfileTab user={currentUser.data} />
                    <UpdateEmailTab user={currentUser.data} />
                    <UpdatePasswordTab />

                </TabPanels>
            </TabNav>
        </section>

    </>
    )
}