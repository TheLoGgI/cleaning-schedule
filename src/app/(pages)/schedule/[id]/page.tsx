import Link from "next/link"
import MembersTab from "../Tabs/MembersTab"
import ModalUpdateSchedule from "../ModalUpdateSchedule"
import RoomTab from "../Tabs/RoomsTab"
import ScheduleTab from "../Tabs/ScheduleTab"
import { ScheduleTable } from "../Tabs/scheduleTable"
import TabNav from "./TabNav"
import { TabPanels } from "@/app/components/Tab"
import { db } from "@/lib/db"
import { room as roomTable } from "@/lib/schema"
import { eq } from "drizzle-orm"

export default async function Page({
  params,
}: {
  params: { id: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const schedule = await db.query.schedule.findFirst({
    where: (s, { eq }) => eq(s.id, params.id),
  })

  if (!schedule) {
    return (
      <section className="container max-w-screen-lg mx-auto py-4 px-8 flex flex-col items-center gap-4">
        <div>
          <h1 className="text-2xl text-center mt-40 font-semibold">
            No Schedule
          </h1>
          <p>Create your own schedule</p>
        </div>
        <Link
          href="/dashboard"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Go to Dashboard
        </Link>
      </section>
    )
  }

  const rooms = await db.query.room.findMany({
    where: eq(roomTable.scheduleID, params.id),
    orderBy: (r, { asc }) => [asc(r.roomNr)],
    with: { user: true },
  })

  const users = rooms.map((r) => r.user).filter(Boolean) as User[]

  return (
    <section className="container max-w-screen-lg mx-auto py-4 px-4">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold inline-block mr-4 capitalize">
          {schedule.name}
          <span className="font-normal text-base ml-2 p-2 bg-gray-200 rounded print:hidden">
            {schedule.isActive ? "Active" : "Inactive"}
          </span>
        </h1>
        <ModalUpdateSchedule schedule={schedule} />
        <p className="print:hidden">
          Starting Week: <span>{schedule.startingWeek}</span>
        </p>
      </header>

      <TabNav>
        <TabPanels>
          <MembersTab users={users} scheduleId={params.id} />
          <RoomTab
            rooms={rooms as unknown as Room[]}
            scheduleId={params.id}
          />
          <ScheduleTab
            rooms={rooms as unknown as Room[]}
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
