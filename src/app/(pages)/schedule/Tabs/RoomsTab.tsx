import { ActionsColumn } from "../clientActionsColum"
import ModalCreateRoom from "../ModalCreateRoom"
import { TabPanel } from "@/app/components/Tab"

const RoomTab = ({
  rooms,
  scheduleId,
}: {
  rooms: Room[]
  scheduleId: string
}) => {
  return (
    <>
      {/* <ModalUpdateRoom room={room} scheduleId={scheduleId} /> */}
      <TabPanel>
        <div className="flex justify-between items-center my-10">
          <ModalCreateRoom
            title="Create Room"
            rooms={rooms}
            scheduleId={scheduleId}
          />
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
                    <td className="px-6 py-4 text-black">
                      {room.User === null
                        ? "Empty"
                        : `${room.User.firstName} ${room.User.lastName}`}
                    </td>
                    <td className="px-6 py-4 text-black">
                      {room.activeInSchedule ? "Active" : "Inactive"}{" "}
                    </td>
                    <ActionsColumn room={room} scheduleId={scheduleId} />
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </TabPanel>
    </>
  )
}

export default RoomTab
