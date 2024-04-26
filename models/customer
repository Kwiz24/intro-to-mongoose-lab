const mongoose = require('mongoose');

// Define the customer schema
const customerSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

// Create the Customer model based on the customer schema
const Customer = mongoose.model('Customer', customerSchema,'customers_CRM');

// Export the Customer model for use in other modules
module.exports = Customer;