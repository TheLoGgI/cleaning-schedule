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
import { includedFeatures } from "@/app/components/landing/PricingSection"
import { CheckIcon } from "@heroicons/react/24/solid"

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
          { isPremium && <p className="text-center">You don&apos;t have any schedules yet.</p>}
        
          { !isPremium && 
          <>
          <h2 className="text-xl text-center mt-8 sm:mt-10">No schedules yet? Get a subscription and create your own.</h2>
          <div className="mx-auto mt-10 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-10 lg:mx-0 lg:flex lg:max-w-none">
            <div className="p-8 sm:p-10 lg:flex-auto">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                Monthly membership
              </h3>
              <p className="mt-6 text-base leading-7 text-gray-600">
                With the monthly membership you get access to all features.
                Members of your schedule do not need to be paying members
                themselves.
              </p>
              <div className="mt-10 flex items-center gap-x-4">
                <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">
                  What&apos;s included
                </h4>
                <div className="h-px flex-auto bg-gray-100" />
              </div>
              <ul
                role="list"
                className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
              >
                {includedFeatures.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className="h-6 w-5 flex-none text-indigo-600"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
              <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                <div className="mx-auto max-w-xs px-8">
                  <p className="text-base font-semibold text-gray-600">
                    Cancel anytime. No questions asked.
                  </p>
                  <p className="mt-6 flex items-baseline justify-center gap-x-2">
                    <span className="text-5xl font-bold tracking-tight text-gray-900">
                      50
                    </span>
                    <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                      DKK
                    </span>
                  </p>
                  <a
                    href="https://buy.stripe.com/14k3gbcNR1Ac7Cw001"
                    target="_blank"
                    className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Get access
                  </a>
                  <p className="mt-6 text-xs leading-5 text-gray-600">
                    Invoices and receipts available for easy company reimbursement
                  </p>
                </div>
              </div>
            </div>
          </div>


          </>
          }
          </div>
        )}
    </section>
  )
}
