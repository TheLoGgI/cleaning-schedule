type User = {
  id: string
  firstName: string
  lastName: string
  email: string
}

type ScheduleRowData = {
  id: number
  weekNr: number
  room: Room
}

type Schedule = {
  scheduleId: string
  weeks: {
    weekNr: number
    rooms: Array<Omit<Room, "id"> & { row: number }>
  }[]
}

type NullableRoom = Room | null

type ScheduleWithNullableRooms = {
  scheduleId: string
  weeks: { weekNr: number; rooms: NullableRoom[] }[]
}

type DashboardSchedule = {
  id: string
  createdAt: string
  startingWeek: number
  name: string
  isActive: boolean
  createdBy: string
}

type Week = {
  weekNr: number
  rooms: Room[]
}

type ScheduleCell = { scheduleRowId: number; weekNr: number }
type ScheduleCellEmptyRoom = { roomId: "Empty"; weekNr: number }

type Room = {
  id: string
  row: number
  activeInSchedule: boolean
  roomNr: number
  User: User
}
type RoomWithoutId = {
  row: number
  activeInSchedule: boolean
  roomNr: number
  User: User
}
