const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the schema for users
const issueSchema = new Schema({
    name: {
        type: String,
        required: [true, "Il faut rentrer un nom de problème."]
    },
    place: {
        type: String,
        required: [true, "Il faut rentrer un nom d'endroit."]
    },
    user:{
        id: {
            type: String,
            required: [true, "Il faut rentrer identifiant d'utilisateur."]
        },
    }
});
// Create the model from the schema and export it
module.exports = mongoose.model('Issue', issueSchema);