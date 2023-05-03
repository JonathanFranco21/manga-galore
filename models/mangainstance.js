const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MangaInstanceSchema = new Schema({
  manga: { type: Schema.Types.ObjectId, ref: "Manga", required: true },
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Currently Publishing", "Finished Publishing"],
    default: "Currently Publishing",
  },
  due_back: { type: Date, default: Date.now },
});

MangaInstanceSchema.virtual("url").get(function () {
  return `/catalog/mangainstance/${this._id}`;
});

MangaInstanceSchema.virtual("due_back_formatted").get(function () {
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

MangaInstanceSchema.virtual("due_back_yyyy_mm_dd").get(function () {
  return DateTime.fromJSDate(this.due_back).toISODate(); //format 'YYYY-MM-DD'
});

module.exports = mongoose.model("MangaInstance", MangaInstanceSchema);