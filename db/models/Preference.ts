import { Model, tableSchema } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export const preferencesTable = tableSchema({
  name: "preferences",
  columns: [
    {
      name: "name",
      type: "string",
    },
    {
      name: "value",
      type: "string",
    }
  ],
})

export class Preference extends Model {
  static table = "preferences";

  static associations = {};

  @field("name") name!: string;
  @field("value") value!: string;
}