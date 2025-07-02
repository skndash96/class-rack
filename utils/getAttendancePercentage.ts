import { AttendanceRecord } from "@/db/models/AttendanceRecord";
import { Subject } from "@/db/models/Subject";

export function getAttendancePercentage(attendanceRecords: AttendanceRecord[], thresholdPercentage: number, subject?: Subject) {
  const req = thresholdPercentage/100

  let totalPresent = subject?.initialPresent || 0, totalClasses = subject?.initialTotalClasses || 0, totalCancelled = 0, totalUnmarked = 0

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

  let comment = "Can NOT miss next class", percentColor  = "BAD" as "GOOD" | "BAD", commentColor = "BAD" as "GOOD" | "BAD"

  if (percent >= thresholdPercentage) {
    const x = Math.floor(totalPresent/req - totalClasses) 

    percentColor = "GOOD"

    if (x > 0) {
      commentColor = "GOOD"
      comment = `Can MISS ${x} more classes`
    }
  } else {
    const x = Math.ceil((totalClasses * req - totalPresent) / (1 - req))

    if (x > 0) {
      comment = `Can NOT miss next ${x} classes`
    }
  }

  return {
    percentage: percent.toFixed(2),
    comment,
    percentColor,
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