type User = {
  id: string
  firstName: string
  lastName: string
  email: string
}

type Schedule = {
  scheduleId: string
  weeks: {
    weekNr: number
    rooms: {
      activeInSchedule: boolean
      roomNr: number
      User: User
    }[]
  }[]
}
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
  userId: string
  User: CustomUser
}
