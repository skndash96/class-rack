import { Model, tableSchema } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

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
    attendanceRecords: {
      type: "has_many" as const,
      foreignKey: "subject_id"
    },
  };

  @field("name") name!: string;
  @field("code") code!: string;
  @field("credits") credits!: number;
}