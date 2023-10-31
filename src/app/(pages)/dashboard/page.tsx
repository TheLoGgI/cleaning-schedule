import { AuthUser } from "@supabase/supabase-js"
import Link from "next/link"
import ModalCreateDashboard from "./ModalCreateDashboard"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

// export const dynamic = 'force-dynamic'

export default async function Login() {
  // const supabase = createSupabaseAuthServerClient()
  const supabase = createServerComponentClient({ cookies })

  // TODO: give feedback for failed user
  const authUser = await supabase.auth.getUser()
  const currentUser = await supabase
    .from("User")
    .select("*")
    .eq("authId", authUser.data.user?.id as string)
    .single()
  console.log("currentUser: ", currentUser)

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

  // TODO: failed to load schedules
  const { data: schedules } = await supabase
    .from("Schedule")
    .select("*")
    .eq("createdBy", currentUser.data?.id as string)

  return (
    <section className="container max-w-screen-lg mx-auto">
      <div className="flex align-center justify-between p-4">
        <h1 className="text-2xl">Dashboard</h1>
        <ModalCreateDashboard
          title="Create new Dashboard"
          user={authUser.data.user as AuthUser}
        />

        {/* </ModalCreateDashboard> */}
      </div>

      {Array.isArray(schedules) && schedules?.length !== 0 ? (
        <div className="px-4 text-lg">
          <div className="grid grid-cols-4 border-b-2 border-gray-200 mb-4">
            <p className="font-semibold">Schedule Name</p>
            <p className="font-semibold">Nr. Rooms</p>
            <p className="font-semibold">Starting Week</p>
            <p className="font-semibold">isActive</p>
          </div>
          {schedules?.map((schedule) => {
            return (
              <Link
                key={schedule.name + schedule.id}
                href={`/schedule/${schedule.id}`}
                className="grid grid-cols-4 p-4 border-b-2 border-gray-200 hover:bg-gray-200"
              >
                <p>{schedule.name}</p>
                <p>0</p>
                <p>{schedule.startingWeek}</p>
                <input
                  readOnly
                  type="checkbox"
                  checked={schedule.isActive}
                  name="isActive"
                  className="text-blue-500 accent-current w-6"
                />
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="px-4 text-lg">
          <p className="text-center">You don&apos;t have any schedules yet.</p>
        </div>
      )}
    </section>
  )
}
