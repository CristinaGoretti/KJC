const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the schema for users
const userSchema = new Schema({
    firstname: String,
    lastname: String
    /*tel: {
        type: Number,
        length:{
            min: 10,
            max: 13
        }
    },
    birthday: Date,
    mail: String,
    gender: {
        enum: ['female', 'male']
    }*/
});
// Create the model from the schema and export it
module.exports = mongoose.model('User', userSchema);