import ScheduleTab, { ScheduleTable } from "../Tabs/ScheduleTab"
import { cookies, headers } from "next/headers"

import { AuthUser } from "@supabase/supabase-js"
import Link from "next/link"
import MembersTab from "../Tabs/MembersTab"
import ModalUpdateSchedule from "../ModalUpdateSchedule"
import RoomTab from "../Tabs/RoomsTab"
import TabNav from "./TabNav"
import { TabPanels } from "@/app/components/Tab"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { request } from "https"

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
          Schedule: {schedule.name}
          <span className="font-normal text-base border p-2 ml-2 rounded">
            {schedule.isActive ? "Active" : "Inactive"}
          </span>
        </h1>
        <ScheduleTable scheduleId={params.id} />
      </section>
    )
  }

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
    <section className="container max-w-screen-lg mx-auto py-4 px-8">
      <header>
        <h1 className="text-2xl font-semibold inline-block mr-4">
          Schedule: {schedule.name}
          <span className="font-normal text-base border p-2 ml-2 rounded">
            {schedule.isActive ? "Active" : "Inactive"}
          </span>
        </h1>
        <ModalUpdateSchedule
          schedule={schedule}
          user={auth.data.user as AuthUser}
        />

        <p>
          Starting Week: <span>{schedule.startingWeek}</span>
        </p>
      </header>

      <TabNav>
        <TabPanels>
          <MembersTab users={users} scheduleId={params.id} />
          <RoomTab
            rooms={rooms.data as unknown as Room[]}
            scheduleId={params.id}
          />
          <ScheduleTab
            scheduleId={params.id}
            startingWeek={schedule.startingWeek}
          />
        </TabPanels>
      </TabNav>
    </section>
  )
}
