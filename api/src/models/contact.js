const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _id: mongoose.Types.ObjectId,
    firstName: {
        type: String,
        required: [true, "First name is required"],
        minLength: [1, "First name should have at least one character"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        minLength: [1, "Last name should have at least one character"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        minLength: [1, "Email should have at least one character"]
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
        minLength: [1, "Phone should have at least one character"]
    },
    image: {
        type: String,
        required: [true, "Image is required"]
    }
});


const Contact = mongoose.model('Contact', schema);

module.exports = Contact;