import { ModalUpdateRoomButton } from "./ModalUpdateRoom"
import { PendingButton } from "@/app/components/signInOut/pendingButton"
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
        <PendingButton
          type="submit"
          name="roomId"
          className="font-medium text-red-600 dark:text-red-500 hover:underline ml-2"
          loading={<span className="text-black">Deleting</span>}
        >
          Delete
        </PendingButton>
      </form>
    </td>
  )
}
