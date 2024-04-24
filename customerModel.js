const mongoose = require('mongoose');

// Define Customer schema
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    }
})

// Create and export the Customer model
module.exports = mongoose.model('Customer', customerSchema);