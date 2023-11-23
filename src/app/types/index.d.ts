type User = {
  id: string
  firstName: string
  lastName: string
  email: string
}

type ScheduleRowData = {
  weekNr: number
  room: Room
}

type Schedule = {
  scheduleId: string
  weeks: Week[]
}

type Week = {
  weekNr: number
  rooms: Room[]
}

type ScheduleCell = { roomId: string; weekNr: number }

// id: string
// createdAt: string
// startingWeek: number
// name: string
// isActive: boolean
// createdBy: string
// }

type Room = {
  id: string
  activeInSchedule: boolean
  roomNr: number
  User: User
}
