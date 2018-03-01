const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the schema for users
const issueSchema = new Schema({
    description: {
        type: String,
        maxlength: [10000, "Description: max 1000 caractères"]
    },
    imageUrl: {
        type: String,
        maxlength: [500, "ImageUrl: max 500 caractères"]
    },
    latitude: {
        type: Number,
        required: [true, "Il faut rentrer une latitude."]
    },
    longitude: {
        type: Number,
        required: [true, "Il faut rentrer une longitude."]
    },
    tags: {
        type: Array,
        items: [{
            type: String,
        }],

    },
    status: {
        type: String,
        enum: ["new", "inProgress", "canceled", "completed"],
        default: "new"
    },
    user:{
        id: {
            type: String,
            required: [true, "Il faut rentrer identifiant d'utilisateur."]
        },
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
// Create the model from the schema and export it
module.exports = mongoose.model('Issue', issueSchema);
