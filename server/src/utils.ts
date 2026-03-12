export function getDurationMinutes(start: string, end: string) {
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000)
}

export function getAge(dob: string) {
  const today = new Date()
  const birth = new Date(dob)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}
