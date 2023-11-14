import ModalInsertScheduleRow from "../ModalInsertScheduleRow"
import { PendingButton } from "@/app/components/signInOut/pendingButton"
import { PrintButton } from "@/app/components/PrintButton"
import { ScheduleTabBody } from "./ScheduleTabBody"
import { TabPanel } from "@/app/components/Tab"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { generateSchedule } from "../../../server/actions/generateSchedule"

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

  const schedule = await supabase
    .from("ScheduleRow")
    .select(
      `*,
    roomOne: Room!ScheduleRow_roomOne_fkey(id, roomNr, User(id, firstName, lastName, email)),
    roomTwo: Room!ScheduleRow_roomTwo_fkey(id, roomNr, User(id, firstName, lastName, email))
    `
    )
    .eq("scheduleId", scheduleId)
    .order("weekNr", { ascending: true })

  return (
    <div className="relative mt-2 overflow-x-auto shadow-md sm:rounded-lg ">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Week Nr.
            </th>
            <th scope="col" className="px-6 py-3">
              1. Cleaner
            </th>
            <th scope="col" className="px-6 py-3">
              2. Cleaner
            </th>
          </tr>
        </thead>
        <ScheduleTabBody schedule={schedule.data as Schedule[]} />
      </table>
    </div>
  )
}

export default ScheduleTab
