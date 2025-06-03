import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export default class Subject extends Model {
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