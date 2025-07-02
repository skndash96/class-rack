import { Model, Query, tableSchema } from "@nozbe/watermelondb";
import { children, date, field } from "@nozbe/watermelondb/decorators";
import { Reminder } from "./Reminder";

export const tasksTable = tableSchema({
  name: "tasks",
  columns: [
    {
      name: "name",
      type: "string",
    },
    {
      name: "description",
      type: "string",
    },
    {
      name: "due_date",
      type: "number",
    },
    {
      name: "duration",
      type: "number", // in minutes
    },
    {
      name: "priority",
      type: "number",
    },
    {
      name: "is_completed",
      type: "boolean",
    },
    {
      name: "created_at",
      type: "number",
    },
    {
      name: "updated_at",
      type: "number",
    },
  ],
})

export class Task extends Model {
  static table = "tasks";

  static associations = {
    reminders: {
      type: "has_many" as const,
      foreignKey: "task_id"
    }
  };

  @field("name") title!: string;
  @field("description") description!: string;
  @date("due_date") dueDate!: Date;
  @field("duration") duration!: number | null;
  @field("priority") priority!: number;
  @field("is_completed") isCompleted!: boolean;
  @date("created_at") createdBy!: Date;
  @date("updated_at") updatedAt!: Date;
  @children("attendance_records") attendanceRecords!: Query<Reminder>;
}