const mongoose = require('mongoose');
const User = require('../models/user');
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
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        validate: {
            validator: existUser,
            isAsync: true
        }
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

function existUser(value, callback){
    User.findOne({ '_id': value }, function (err, user){
        if(user){
            callback(true);
        } else {
            callback(false);
        }
    });
}
// Create the model from the schema and export it
module.exports = mongoose.model('Issue', issueSchema);
