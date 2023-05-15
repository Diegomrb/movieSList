const mongoose = require("mongoose");
let schema = mongoose.Schema;

let schema_ = new schema({
    user: String,
    pass: String
})
let Usuario = mongoose.model("usuarios", schema_)
module.exports = Usuario;
