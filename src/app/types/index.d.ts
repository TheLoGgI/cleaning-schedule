type User = {
  id: string
  firstName: string
  lastName: string
  email: string
}

type Schedule = {
  id: string
  createdAt: string
  startingWeek: number
  name: string
  isActive: boolean
  createdBy: string
}

type Room = {
  id: string
  activeInSchedule: boolean
  roomNr: number
  userId: string
  User: CustomUser
}
