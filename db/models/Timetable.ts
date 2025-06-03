import { Relation } from "@nozbe/watermelondb";
import Model from "@nozbe/watermelondb/Model";
import { field, relation } from "@nozbe/watermelondb/decorators";
import Subject from "./Subject";

export default class Timetable extends Model {
  static table = "timetable";

  static associations = {};

  @relation("subjects", "subject_id") subject!: Relation<Subject>;

  @field("subject_id") subjectId!: string;
  @field("day_of_week") dayOfWeek!: number; // 0 = sunday
  @field("slot_number") slotNumber!: number;
}