const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the schema for users
const userSchema = new Schema({
    firstname: {
		type : String,
		minLength : 2,
		maxLength : 20,
		required: [true, "Il faut entrer un prénom."]
	},
    lastname: {
        type: String,
		minLength : 2,
		maxLength : 20,
        required: [true, "Il faut entrer un nom de famille."]
    },
    role: {
		type: String,
		enum: ["citizen","manager"],
		required: [true, "Il faut entrer un role"]
		
	},
	createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.index({ firstname: 1, lastname: 1  }, { unique: true });

// Create the model from the schema and export it
module.exports = mongoose.model('User', userSchema);

