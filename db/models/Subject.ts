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
      name: "initial_present",
      type: "number",
      isOptional: true,
    },
    {
      name: "initial_total_classes",
      type: "number",
      isOptional: true,
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
  @field("initial_present") initialPresent!: number;
  @field("initial_total_classes") initialTotalClasses!: number;
  @readonly @date("created_at") createdAt!: Date;

  // TODO: make this a lazy query
  @children("attendance_records") attendanceRecords!: Query<AttendanceRecord>;

  @lazy sortedAttendanceRecords = this.attendanceRecords.extend(Q.sortBy("date", "desc"))
}