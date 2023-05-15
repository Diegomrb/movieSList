const mongoose = require("mongoose");
let schema = mongoose.Schema;
let schema_ = new schema({
    title: String,
    year: Number,
    genero: String,
    description:String,
    status: String,
    category: String,
    id_Usuario: String,
})
let content = mongoose.model("contents", schema_);
module.exports = content;
