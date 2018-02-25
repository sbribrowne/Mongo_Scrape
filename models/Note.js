var mongoose = require("mongoose");


var Schema = mongoose.Schema;

//Note schema
var NoteSchema = new Schema({
  body: String
});


var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
