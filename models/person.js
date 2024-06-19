const mongoose = require("mongoose");

const Person = mongoose.model("Person", {

    name: String,
    salary: Number,
    cpf: String,
    approved: Boolean
});

module.exports = Person;