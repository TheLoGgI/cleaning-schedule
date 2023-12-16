import { AuthUser, PostgrestSingleResponse } from "@supabase/supabase-js"
import {
  ModalDeleteScheduleButton,
  ModalDeleteScheduleContextProvider,
} from "./ModalDeleteDashboard"

import Link from "next/link"
import ModalCreateDashboard from "./ModalCreateDashboard"
import { Role } from "@/app/components/EnumRole"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

// export const dynamic = 'force-dynamic'

type UserWithSchedules = {
  id: string
  firstName: string
  lastName: string
  email: string
  authId: string
  premium: boolean
  schedules: {
    id: string
    name: string
    startingWeek: number
    isActive: boolean
  }[]
}

function uniqByKeepLast<T>(a: Array<T>, key: (val: T) => T) {
  return [...new Map(a.map((x) => [key(x), x])).values()]
}

export default async function Dashboard() {
  // const supabase = createSupabaseAuthServerClient()
  const supabase = createServerComponentClient({ cookies })

  // TODO: give feedback for failed user
  const authUser = await supabase.auth.getUser()

  const currentUser = (await supabase
    .from("User")
    .select(`*, schedules: Room( ...Schedule(*, role: ScheduleRole(role)))`)
    .eq("authId", authUser.data.user?.id as string)
    .single()) as unknown as PostgrestSingleResponse<UserWithSchedules>

  const isPremium = currentUser.data?.premium || false

  if (authUser.data.user === null || currentUser === null) {
    return (
      <section className="container max-w-screen-lg mx-auto py-4 px-8 flex flex-col items-center gap-4">
        <h1 className="text-2xl text-center mt-40 font-semibold">
          You need to login to watch your dashboard
        </h1>
        <p>Login to create your own dashboard</p>
        <Link
          href="/login"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Log in
        </Link>
      </section>
    )
  }

  // TODO: give edit rights for owners and admins
  // TODO: failed to load schedules
  const ownedSchedules = await supabase
    .from("Schedule")
    .select("*")
    .eq("createdBy", currentUser.data?.id as string)

  const availableSchedules = uniqByKeepLast(
    [...(ownedSchedules.data ?? []), ...(currentUser.data?.schedules ?? [])],
    (schedule) => schedule.id
  )

  return (
    <section className="container max-w-screen-lg mx-auto">
      <div className="flex align-center justify-between p-4">
        <h1 className="text-2xl">Dashboard</h1>
        <ModalCreateDashboard
          user={authUser.data.user as AuthUser}
          isPremium={isPremium}
        />
      </div>

      {Array.isArray(availableSchedules) && availableSchedules?.length !== 0 ? (
        <div className="px-4 text-lg">
          <div className="flex justify-between border-b-2 border-gray-200">
            <div className="lg:grid gap-10 lg:grid-cols-4 p-4 pr-0 flex-grow">
              <p className="font-semibold col-span-2">Schedule Name</p>
              <p className="font-semibold hidden lg:block">Starting Week</p>
              <p className="font-semibold hidden lg:block">isActive</p>
            </div>
            {/* For matching the columns with the header columns */}
            <div className="invisible px-4">delete</div>
          </div>
          <ModalDeleteScheduleContextProvider>
            {availableSchedules.map((schedule) => {
              const roleInSchedule = schedule?.role?.[0]?.role ?? Role.User
              return (
                <div
                  key={schedule.name + schedule.id}
                  className="flex justify-between items-center border-b-2 border-gray-200 hover:bg-gray-200"
                >
                  <Link
                    href={`/schedule/${schedule.id}`}
                    className="lg:grid gap-10 lg:grid-cols-4 p-4 pr-0 flex-grow"
                  >
                    <p className="col-span-2 capitalize">{schedule.name}</p>
                    <p className="hidden lg:block">{schedule.startingWeek}</p>
                    <p className="hidden lg:block">
                      {String(schedule.isActive)}
                    </p>
                  </Link>
                  {roleInSchedule === Role.Admin ? (
                    <div className="p-4">
                      <ModalDeleteScheduleButton
                        schedule={schedule as DashboardSchedule}
                        authId={authUser.data.user?.id as AuthUser["id"]}
                      />
                    </div>
                  ) : (
                    <div className="invisible px-4">delete</div>
                  )}
                </div>
              )
            })}
          </ModalDeleteScheduleContextProvider>
        </div>
      ) : (
        <div className="px-4 text-lg">
          <p className="text-center">You don&apos;t have any schedules yet.</p>
        </div>
      )}
    </section>
  )
}
