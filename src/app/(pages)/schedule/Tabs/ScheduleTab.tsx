import { TabPanel } from "@/app/components/Tab"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { generateSchedule } from "../../../server/actions/generateSchedule"

const ScheduleTab = async ({
  scheduleId,
  startingWeek,
}: {
  scheduleId: string
  startingWeek: number
}) => {
  return (
    <TabPanel>
      <form action={generateSchedule}>
        <input type="hidden" name="scheduleId" value={scheduleId} />
        <input type="hidden" name="startingWeek" value={startingWeek} />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Generate Schedule
        </button>
      </form>

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

  return (
    <div className="relative mt-2 overflow-x-auto shadow-md sm:rounded-lg">
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
        <tbody>
          {schedule.data?.map((row: any) => {
            return (
              <tr
                key={row.id}
                className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
              >
                <td className="px-6 py-4">{row.weekNr}</td>
                <td className="px-6 py-4">
                  {row.roomOne === null
                    ? "Empty"
                    : `${row.roomOne.roomNr}: ${row.roomOne.User?.firstName} ${row.roomOne.User?.lastName}`}
                </td>
                <td className="px-6 py-4">
                  {row.roomTwo === null
                    ? "Empty"
                    : `${row.roomTwo.roomNr}: ${row.roomTwo.User?.firstName} ${row.roomTwo.User?.lastName}`}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ScheduleTab
