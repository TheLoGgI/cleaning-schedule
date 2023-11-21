import { ScheduleTabBody, ScheduleTabBodyAdmin } from "./ScheduleTabBody"

import ModalInsertScheduleRow from "../ModalInsertScheduleRow"
import { PendingButton } from "@/app/components/signInOut/pendingButton"
import { PrintButton } from "@/app/components/PrintButton"
import { Role } from "@/app/components/EnumRole"
import { TabPanel } from "@/app/components/Tab"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { generateSchedule } from "../../../server/actions/generateSchedule"
import { getSchedule } from "@/app/server/quries/getSchedule"

const ScheduleTab = ({
  rooms,
  scheduleId,
  startingWeek,
}: {
  rooms: Room[]
  scheduleId: string
  startingWeek: number
}) => {
  return (
    <TabPanel>
      <div className="flex justify-between items-center print:hidden">
        <div className="flex gap-4 my-10">
          <ModalInsertScheduleRow
            weekNr={startingWeek}
            rooms={rooms}
            scheduleId={scheduleId}
          />
          <form action={generateSchedule}>
            <input type="hidden" name="scheduleId" value={scheduleId} />
            <input type="hidden" name="startingWeek" value={startingWeek} />
            <PendingButton
              type="submit"
              className="border-2 border-blue-700 hover:bg-blue-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Generate Schedule
            </PendingButton>
          </form>
        </div>
        <PrintButton />
      </div>

      <ScheduleTable scheduleId={scheduleId} />
    </TabPanel>
  )
}

export const ScheduleTable = async ({ scheduleId }: { scheduleId: string }) => {
  const supabase = createServerComponentClient<any>({ cookies })
  const auth = await supabase.auth.getUser()

  const schedule = await getSchedule(scheduleId, auth, supabase)

  const maxRoomsInWeek = schedule?.weeks.reduce(
    (roomsInWeek, row) =>
      row.rooms.length > roomsInWeek ? row.rooms.length : roomsInWeek,
    0
  ) as number
  // const tableHeadCount = Array.from({ length: maxRoomsInWeek })

  console.log("maxRoomsInWeek: ", maxRoomsInWeek)

  console.log("schedule: ", JSON.stringify(schedule))

  const role = await supabase
    .from("ScheduleRole")
    .select("role")
    .match({
      scheduleId: scheduleId,
      authId: auth.data.user?.id,
    })
    .single()

  const isUserAdmin =
    role.data?.role ===
    Role.Admin /* || Role[role.data?.role as keyof typeof Role] === Role.Moderator */

  return (
    <div className="relative mt-8 overflow-x-auto shadow-md sm:rounded-lg ">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Week Nr.</th>
            <th
              className="px-6 py-3 text-center bg-gray-100"
              colSpan={maxRoomsInWeek}
            >
              Cleaners
            </th>
          </tr>
        </thead>

        {schedule !== null ? (
          isUserAdmin ? (
            <ScheduleTabBodyAdmin schedule={schedule} />
          ) : (
            <ScheduleTabBody schedule={schedule} />
          )
        ) : null}
      </table>
    </div>
  )
}

export default ScheduleTab
