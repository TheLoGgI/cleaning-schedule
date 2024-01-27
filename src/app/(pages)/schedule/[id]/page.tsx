import { AuthUser } from "@supabase/supabase-js"
import EconomyTab from "../Tabs/EconomyTab"
import Link from "next/link"
import MembersTab from "../Tabs/MembersTab"
import ModalUpdateSchedule from "../ModalUpdateSchedule"
import { Role } from "@/app/components/EnumRole"
import RoomTab from "../Tabs/RoomsTab"
import ScheduleTab from "../Tabs/ScheduleTab"
import { ScheduleTable } from "../Tabs/scheduleTable"
import TabNav from "./TabNav"
import { TabPanels } from "@/app/components/Tab"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

export default async function Page({
  params,
}: {
  params: { id: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createServerComponentClient<any>({ cookies })
  const auth = await supabase.auth.getUser()

  const { data: schedule, error } = await supabase
    .from("Schedule")
    .select("*")
    .eq("id", params.id)
    .single()

  if (schedule === null && error !== null) {
    return (
      <section className="container max-w-screen-lg mx-auto py-4 px-8 flex flex-col items-center gap-4">
        <div>
          <h1 className="text-2xl text-center mt-40 font-semibold">
            No Schedule
          </h1>
          <p>Create your own schedule</p>
        </div>
        <Link
          href="/schedule/create"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Create Schedule
        </Link>
      </section>
    )
  }

  if (schedule.isActive === false && auth.data.user === null) {
    return (
      <section className="container max-w-screen-lg mx-auto py-4 px-8 flex flex-col items-center gap-4">
        <div>
          <h1 className="text-2xl text-center mt-40 font-semibold">
            No Schedule
          </h1>
          <p>Login to create your own schedule</p>
        </div>
        <Link
          href="/login"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Login
        </Link>
      </section>
    )
  }

  if (auth.data.user === null) {
    // User not allowed
    // TODO: add anonymisering of users in schedule (only numbers or firstNames)
    return (
      <section className="container max-w-screen-lg mx-auto py-4 px-8">
        <h1 className="text-2xl font-semibold">{schedule?.name}</h1>
        <ScheduleTable scheduleId={params.id} />
      </section>
    )
  }

  const scheduleRole = await supabase
    .from("ScheduleRole")
    .select("role")
    .match({
      scheduleId: params.id,
      authId: auth.data.user.id,
    })
    .single()

  const userRole = scheduleRole.data ? scheduleRole.data?.role : Role.User

  const isAdmin = userRole === Role.Admin
  const isAdminOrModerator =
    userRole === Role.Admin || userRole === Role.Moderator

  const rooms = await supabase
    .from("Room")
    .select(
      `
    id, activeInSchedule,  roomNr,
    User(id, firstName, lastName, email)
  `
    )
    .eq("scheduleID", params.id)
    .order("roomNr", { ascending: true })

  const users = (rooms.data?.map((room) => room.User) ||
    []) as unknown as User[]

  return (
    <section className="container max-w-screen-lg mx-auto py-4 px-4">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold inline-block mr-4 capitalize">
          {schedule?.name}
          <span className="font-normal text-base ml-2 p-2 bg-gray-200 rounded print:hidden">
            {schedule.isActive ? "Active" : "Inactive"}
          </span>
        </h1>
        {isAdmin && (
          <ModalUpdateSchedule
            schedule={schedule}
            user={auth.data.user as AuthUser}
          />
        )}

        <p className="print:hidden">
          Starting Week: <span>{schedule.startingWeek}</span>
        </p>
      </header>

      <TabNav userRole={userRole}>
        <TabPanels>
          {isAdminOrModerator && (
            <MembersTab users={users} scheduleId={params.id} />
          )}
          <RoomTab
            rooms={rooms.data as unknown as Room[]}
            scheduleId={params.id}
          />
          <ScheduleTab
            rooms={rooms.data as unknown as Room[]}
            scheduleId={params.id}
            startingWeek={schedule.startingWeek}
          >
            <ScheduleTable scheduleId={params.id} />
          </ScheduleTab>
          {/* {isAdmin && <EconomyTab scheduleId={params.id} users={users} />} */}
        </TabPanels>
      </TabNav>
    </section>
  )
}
