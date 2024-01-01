export function shuffleRooms(rooms: Room[]): Room[] {
  let currentIndex = rooms.length,
    temporaryValue,
    randomIndex,
    counter = 0
  const schedule: Schedule[] = []

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    counter++
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = rooms[currentIndex]
    rooms[currentIndex] = rooms[randomIndex]
    rooms[randomIndex] = temporaryValue
  }

  return rooms
}
