"use client"

import { ActionsColumn } from "../clientActionsColum"
import ModalCreateRoom from "../ModalCreateRoom"
import { ModalUpdateRoomContextProvider } from "../ModalUpdateRoom"
import { Role } from "@/app/components/EnumRole"
import { TabPanel } from "@/app/components/Tab"
import { useUserRole } from "@/app/hooks/useUserRole"

const RoomTab = ({
  rooms,
  scheduleId,
}: {
  rooms: Room[]
  scheduleId: string
}) => {
  const userRole = useUserRole()
  const isAdminOrModerator =
    userRole === Role.Admin || userRole === Role.Moderator

  return (
    <>
      <TabPanel>
        <ModalUpdateRoomContextProvider>
          <div className="flex justify-between items-center my-10">
            {isAdminOrModerator && (
              <ModalCreateRoom
                title="Create Room"
                rooms={rooms}
                scheduleId={scheduleId}
              />
            )}
            <p>
              Active rooms:{" "}
              {rooms.filter((value) => value.activeInSchedule).length} of{" "}
              {rooms.length}
            </p>
          </div>

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
                  {isAdminOrModerator && (
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  )}
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
                      <td className="px-6 py-4 text-black">
                        {room.User === null
                          ? "Empty"
                          : `${room.User.firstName} ${room.User.lastName}`}
                      </td>
                      <td className="px-6 py-4 text-black">
                        {room.activeInSchedule ? "Active" : "Inactive"}{" "}
                      </td>
                      {isAdminOrModerator && (
                        <ActionsColumn room={room} scheduleId={scheduleId} />
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </ModalUpdateRoomContextProvider>
      </TabPanel>
    </>
  )
}

export default RoomTab
