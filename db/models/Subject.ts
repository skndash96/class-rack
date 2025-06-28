import { Model, Q, Query, tableSchema } from "@nozbe/watermelondb";
import { children, field, lazy } from "@nozbe/watermelondb/decorators";
import { AttendanceRecord } from "./AttendanceRecord";

export const subjectsTable = tableSchema({
  name: "subjects",
  columns: [
    {
      name: "name",
      type: "string",
    },
    {
      name: "code",
      type: "string",
    },
    {
      name: "credits",
      type: "number",
    },
  ],
})

export class Subject extends Model {
  static table = "subjects";

  static associations = {
    "attendance_records": {
      type: "has_many" as const,
      foreignKey: "subject_id"
    },
  };

  @field("name") name!: string;
  @field("code") code!: string;
  @field("credits") credits!: number;

  // TODO: make this a lazy query
  @children("attendance_records") attendanceRecords!: Query<AttendanceRecord>;

  @lazy sortedAttendanceRecords = this.attendanceRecords.extend(Q.sortBy("date", "desc"))
}