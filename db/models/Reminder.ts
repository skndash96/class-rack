import { Model, Relation, tableSchema } from "@nozbe/watermelondb";
import { field, relation } from "@nozbe/watermelondb/decorators";
import { Task } from "./Task";

export const remindersTable = tableSchema({
  name: "reminders",
  columns: [
    {
      name: "task_id",
      type: "string",
    },
    {
      name: "remind_at",
      type: "number",
    }
  ],
})

export class Reminder extends Model {
  static table = "reminders";

  static associations = {
    tasks: {
      type: 'belongs_to' as const,
      key: 'task_id'
    },
  };

  @relation("tasks", "task_id") task!: Relation<Task>;

  @field("task_id") taskId!: string;
  @field("remind_at") remindAt!: number;
}