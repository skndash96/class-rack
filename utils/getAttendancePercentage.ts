import { DEFAULT_ATTENDANCE_THRESHOLD_PERCENTAGE } from "@/constants/defaultPreferences";
import { AttendanceRecord } from "@/db/models/AttendanceRecord";

export function getAttendancePercentage(attendanceRecords: AttendanceRecord[], thresholdPercentage: number = DEFAULT_ATTENDANCE_THRESHOLD_PERCENTAGE) {
  const req = thresholdPercentage/100

  let totalPresent = 0, totalClasses = 0, totalCancelled = 0, totalUnmarked = 0

  attendanceRecords.forEach(record => {
    if (record.status === 1) {
      totalPresent++
      totalClasses++
    } else if (record.status === 0) {
      totalClasses++
    } else if (record.status === 2) {
      totalCancelled++
    } else if (record.status === null || record.status === undefined) {
      totalUnmarked++
    }
  })

  const percent = totalClasses === 0 ? 100 : (totalPresent / totalClasses) * 100

  let comment = "Can NOT miss next class", commentColor = "WARN" as "GOOD" | "WARN" | "BAD"

  if (percent >= thresholdPercentage) {
    const x = Math.floor(totalPresent/req - totalClasses) 

    if (x > 0) {
      comment = `Can MISS ${x} more classes`
      commentColor = "GOOD"
    }
  } else {
    const x = Math.ceil((totalClasses * req - totalPresent) / (1 - req))

    if (x > 0) {
      comment = `Can NOT miss next ${x} classes`
      commentColor = "BAD"
    }
  }

  return {
    percentage: percent.toFixed(2),
    comment,
    commentColor,
    totalClasses,
    totalPresent,
    totalCancelled,
    totalUnmarked,
    markingColor: totalUnmarked > 0 
      ? "cyan"
      : totalClasses > totalPresent
      ? "red"
      :  totalClasses > 0
      ? "green"
      : "transparent"
  }
}