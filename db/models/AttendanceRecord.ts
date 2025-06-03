import { Model, Relation } from "@nozbe/watermelondb";
import { date, field, relation } from "@nozbe/watermelondb/decorators";
import Subject from "./Subject";

export default class AttendanceRecord extends Model {
  static table = "attendance_records";

  static associations = {};

  @relation("subjects", "subject_id") subject!: Relation<Subject>;

  @field("subject_id") subjectId!: string;
  @field("status") status!: number; // 0 = absent, 1 = present, 2 = leave
  @date("updated_at") updatedAt!: Date
}