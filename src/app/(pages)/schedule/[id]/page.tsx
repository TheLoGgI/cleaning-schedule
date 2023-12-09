import { AuthUser } from "@supabase/supabase-js"
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

// import ModalUpdateSchedule from '@/app/schedule/ModalUpdateSchedule'

// export const dynamic = 'force-dynamic'

export default async function Page({
  params,
}: {
  params: { id: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createServerComponentClient<any>({ cookies })
  const auth = await supabase.auth.getUser()

  const { data: schedule } = await supabase
    .from("Schedule")
    .select("*")
    .eq("id", params.id)
    .single()

  if (auth.data.user === null && schedule.isActive === false) {
    return (
      <section className="container max-w-screen-lg mx-auto py-4 px-8 flex flex-col items-center gap-4">
        <h1 className="text-2xl text-center mt-40 font-semibold">
          No Schedule with this id
        </h1>
        <p>Login to create your own schedule</p>
        <Link
          href="/login"
          className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
        >
          Login
        </Link>
      </section>
    )
  }

  if (auth.data.user === null) {
    // User not allowed
    return (
      <section className="container max-w-screen-lg mx-auto py-4 px-8">
        <h1 className="text-2xl font-semibold">
          <span className="font-normal text-base border p-2 mx-2 rounded">
            {schedule.isActive ? "Active" : "Inactive"}
          </span>
          {schedule.name}
        </h1>
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

  const isUserAdmin = userRole === Role.Admin

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

  const isAdminOrModerator =
    userRole === Role.Admin || userRole === Role.Moderator

  return (
    <section className="container max-w-screen-lg mx-auto py-4 px-8">
      <header>
        <h1 className="text-2xl font-semibold inline-block mr-4">
          {schedule.name}
          <span className="font-normal text-base ml-2 p-2 bg-gray-200 rounded print:hidden">
            {schedule.isActive ? "Active" : "Inactive"}
          </span>
        </h1>
        {isUserAdmin && (
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
        </TabPanels>
      </TabNav>
    </section>
  )
}
