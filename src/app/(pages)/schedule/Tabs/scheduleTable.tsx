import { DisplayTableBody } from "./ScheduleTabBody"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { getSchedule } from "@/app/server/quries/getSchedule"

export const ScheduleTable = async ({ scheduleId }: { scheduleId: string }) => {
  const supabase = createServerComponentClient<any>({ cookies })
  const auth = await supabase.auth.getUser()

  const schedule = await getSchedule(scheduleId, auth, supabase)

  const maxRoomsInWeek = schedule?.weeks.reduce(
    (roomsInWeek, row) =>
      row.rooms.length > roomsInWeek ? row.rooms.length : roomsInWeek,
    0
  ) as number

  if (schedule === null || schedule.weeks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <p className="text-center text-2xl font-semibold">
          No schedule has been created yet
        </p>
        <p className="text-gray-500">Ask your admin to create a schedule</p>
      </div>
    )
  }

  return (
    <div className="relative mt-8 overflow-x-auto shadow-md sm:rounded-lg ">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase">
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

        <DisplayTableBody schedule={schedule} />
      </table>
    </div>
  )
}
