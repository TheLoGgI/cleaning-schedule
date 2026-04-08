import { ModalUpdateRoomButton } from "./ModalUpdateRoom"
import { deleteRoom } from "@/app/server/actions/deleteRoomAction"

type Props = {
  room: Room
  scheduleId: string
}

export const ActionsColumn = ({ room, scheduleId }: Props) => {
  return (
    <td className="px-6 py-4">
      <ModalUpdateRoomButton room={room} scheduleId={scheduleId} />
      <form action={deleteRoom} className="inline-block">
        <input type="hidden" name="roomId" value={room.id} />
        <input type="hidden" name="scheduleId" value={scheduleId} />
        <button
          type="submit"
          name="roomId"
          className="font-medium text-red-600 dark:text-red-500 hover:underline sm:ml-2 py-2 sm:py-0"
        >
          Delete
        </button>
      </form>
    </td>
  )
}
