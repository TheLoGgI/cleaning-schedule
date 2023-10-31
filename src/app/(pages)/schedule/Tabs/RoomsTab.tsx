"use server"

import { ActionsColumn } from "../clientActionsColum"
import ModalCreateRoom from "../ModalCreateRoom"
import { TabPanel } from "@/app/components/Tab"
import { createRoom } from "../../../server/actions/createRoom"

// import Messages from "../../login/messages"

const RoomTab = ({
  rooms,
  scheduleId,
}: {
  rooms: Room[]
  scheduleId: string
}) => {
  return (
    <TabPanel>
      <ModalCreateRoom title="Create Room">
        <form
          className="flex-1 flex flex-col w-full px-10 py-4 pb-6 justify-center gap-2 text-foreground"
          action={createRoom}
        >
          <input type="hidden" name="scheduleId" value={scheduleId} />
          <div className="flex flex-col">
            <label className="text-md dark:text-white" htmlFor="email">
              Room Number
            </label>
            <input
              type="number"
              defaultValue={(rooms?.length || 0) + 1}
              className="rounded-md px-4 py-2 bg-inherit dark:bg-slate-500 dark:text-white border mb-6"
              name="roomNr"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-md dark:text-white" htmlFor="email">
              First Name
            </label>
            <input
              className="rounded-md px-4 py-2 bg-inherit dark:bg-slate-500 dark:text-white border mb-6"
              name="firstName"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-md dark:text-white" htmlFor="email">
              Last Name
            </label>
            <input
              className="rounded-md px-4 py-2 bg-inherit dark:bg-slate-500 dark:text-white border mb-6"
              name="lastName"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-md dark:text-white" htmlFor="email">
              In Schedule Rotation
            </label>
            <input
              type="checkbox"
              className="rounded-md px-4 py-2 bg-inherit dark:bg-slate-500 dark:text-white border mb-6"
              name="inCleaningSchedule"
            />
          </div>

          <button
            type="submit"
            className="border border-gray-700 dark:border-gray-300 bg-blue-400 hover:bg-blue-500 dark:text-white rounded px-4 py-2 text-black"
          >
            Create Room
          </button>

          {/* <Messages /> */}
        </form>
      </ModalCreateRoom>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Room Number
              </th>
              <th scope="col" className="px-6 py-3">
                Member Name
              </th>
              <th scope="col" className="px-6 py-3">
                In Schedule
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => {
              return (
                <tr
                  key={room.id}
                  className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                >
                  <td className="px-6 py-4">{room.roomNr} </td>
                  <td className="px-6 py-4">
                    {room.User === null
                      ? "Empty"
                      : `${room.User.firstName} ${room.User.lastName}`}
                  </td>
                  <td className="px-6 py-4">
                    {room.activeInSchedule ? "Active" : "Inactive"}{" "}
                  </td>
                  <ActionsColumn
                    room={room}
                    scheduleId={scheduleId}
                    // onDelete={() => {}}
                  />

                  {/* </form> */}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </TabPanel>
  )
}

export default RoomTab
