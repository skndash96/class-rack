import { Model, Q, Query, tableSchema } from "@nozbe/watermelondb";
import { children, date, field, lazy, readonly } from "@nozbe/watermelondb/decorators";
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
    {
      name: "is_archived",
      type: "boolean"
    },
    {
      name: 'created_at',
      type: 'number'
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
  @field("is_archived") isArchived!: boolean;
  @readonly @date("created_at") createdAt!: Date;

  // TODO: make this a lazy query
  @children("attendance_records") attendanceRecords!: Query<AttendanceRecord>;

  @lazy sortedAttendanceRecords = this.attendanceRecords.extend(Q.sortBy("date", "desc"))
}