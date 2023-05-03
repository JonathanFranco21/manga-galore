const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MangaSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
});

MangaSchema.virtual("url").get(function () {
  return `/catalog/manga/${this._id}`;
});

module.exports = mongoose.model("Manga", MangaSchema);