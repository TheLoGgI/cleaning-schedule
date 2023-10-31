"use client"

import ModalUpdateRoom from "./ModalUpdateRoom"
import { createPortal } from "react-dom"
import { revalidatePath } from "next/cache"

// import { updateRoom } from '../actions/updateRoom'

type Props = {
  room: Room
  scheduleId: string
  onDelete?: (roomId: string) => void
}

export const ActionsColumn = ({ room, scheduleId, onDelete }: Props) => {
  const handleDeleteRoom = async (roomId: string) => {
    const response = await fetch(
      `/api/room/delete?roomId=${roomId}&scheduleId=${scheduleId}`,
      {
        method: "DELETE",
        //   body: JSON.stringify({ roomId, scheduleId }),
      }
    )

    if (response.status === 200) {
      onDelete?.(roomId)
      // TODO: Fix revalidatePath, client not server
      // revalidatePath(`/schedule/${scheduleId}`)
      //   window.location.reload()
    }
  }

  return (
    <td className="px-6 py-4 space-x-2">
      <ModalUpdateRoom room={room} scheduleId={scheduleId} />
      <button
        type="submit"
        name="roomId"
        onClick={() => handleDeleteRoom(room.id)}
        className="px-2 font-medium text-red-600 dark:text-red-500 hover:underline"
      >
        Delete
      </button>
      {/* </form> */}
    </td>
  )
}
