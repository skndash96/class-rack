import { Model, Relation, tableSchema } from "@nozbe/watermelondb";
import { date, field, readonly, relation } from "@nozbe/watermelondb/decorators";
import { Subject } from "./Subject";

export const attendanceRecordsTable = tableSchema({
  name: 'attendance_records',
  columns: [
    {
      name: 'subject_id',
      type: 'string',
    },
    {
      name: 'status', // 0 = absent, 1 = present, 2 = leave
      type: 'number',
      isIndexed: true,
      isOptional: true
    },
    {
      name: 'date',
      type: 'number'
    },
    {
      name: 'updated_at',
      type: 'number'
    },
  ]
})

export class AttendanceRecord extends Model {
  static table = "attendance_records";

  static associations = {
    subjects: {
      type: 'belongs_to' as const,
      key: 'subject_id'
    },
  };

  @relation("subjects", "subject_id") subject!: Relation<Subject>;

  @field("subject_id") subjectId!: string;
  @field("status") status?: number; // 0 = absent, 1 = present, 2 = leave
  @date("date") updatedAt!: number;
  @readonly @date("updated_at") date!: Date;
}