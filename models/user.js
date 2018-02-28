const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the schema for users
const userSchema = new Schema({
    firstname: String,
    lastname: {
        type: String,
        required: [true, "Il faut rentrer un nom de famille."]
    },
    tel: {
        type: String,
        minlength: [10, "Tél: Il manque des chiffres!"],
        maxlength: [13, "Tél: Il y a trop de chiffres"],
        required: [true, "Tél: T'as pas de téléphone? Non mais hallo?"]
    },
    birthday: {
        type: Date,
        required: [true, "Il faut rentrer une date d'anniversaire."]
    },
    mail: {
        type: String,
        required: [true, "Il faut rentrer une adresse email."]
    },
    gender: {
        type: String,
        enum: ["female", "male"]
    }
});
// Create the model from the schema and export it
module.exports = mongoose.model('User', userSchema);