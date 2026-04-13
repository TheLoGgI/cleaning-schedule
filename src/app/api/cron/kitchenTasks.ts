export const days: Record<number, string> = {
  0: "Monday",
  1: "Tuesday",
  2: "Wednesday",
  3: "Thursday",
  4: "Friday",
  5: "Saturday",
  6: "Sunday",
}

export const tasks: { task: string; days: number[] }[] = [
  { task: "Vacuum common areas", days: [0, 3] },
  { task: "Mop kitchen floor", days: [1, 4] },
  { task: "Clean kitchen surfaces", days: [0, 2, 4] },
  { task: "Empty trash", days: [0, 3, 6] },
  { task: "Clean stovetop", days: [2, 5] },
  { task: "Deep clean bathroom", days: [6] },
]
