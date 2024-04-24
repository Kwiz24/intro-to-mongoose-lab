const express = require('express')
const nodemon = require('nodemon')
const dotenv = require('dotenv');
const prompt = require('prompt-sync')();
dotenv.config();
const mongoose = require('mongoose');


require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the application logic here
    startApp();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

// Load Customer Model
const Customer = require('./customerModel');

function displayMenu() {
  console.log('\nWelcome to the CRM\n');
  console.log('What would you like to do?\n');
  console.log('  1. Create a customer');
  console.log('  2. View all customers');
  console.log('  3. Update a customer');
  console.log('  4. Delete a customer');
  console.log('  5. Quit\n');
}

function getUserChoice() {
  return parseInt(prompt('Number of action to run: '));
}

function startApp() {
  while (true) {
    displayMenu();
    const choice = getUserChoice();
    switch (choice) {
      case 1:
        createCustomer();
        break;
      case 2:
        viewAllCustomers();
        break;
      case 3:
        updateCustomer();
        break;
      case 4:
        deleteCustomer();
        break;
      case 5:
        console.log('Exiting...');
        process.exit();
      default:
        console.log('Invalid choice');
    }
  }
}

function createCustomer() {
  console.log('Creating a customer\n');
  const name = prompt('Enter customer name: ');
  const age = parseInt(prompt('Enter customer age: '));
  const newCustomer = new Customer({ name, age });
  newCustomer.save()
    .then(() => {
      console.log('Customer created successfully');
    })
    .catch((err) => {
      console.error('Error creating customer:', err.message);
    });
}

async function viewAllCustomers() {
  console.log('Viewing all customers\n');
  try {
    const customers = await Customer.find();
    customers.forEach((customer) => {
      console.log(`id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`);
    });
  } catch (err) {
    console.error('Error fetching customers:', err.message);
  }
}

async function updateCustomer() {
  console.log('Updating a customer\n');
  await viewAllCustomers();
  const customerId = prompt('Copy and paste the id of the customer you would like to update here: ');
  const customer = await Customer.findById(customerId);
  if (!customer) {
    console.log('Customer not found');
    return;
  }
  const newName = prompt('What is the customer\'s new name? ');
  const newAge = parseInt(prompt('What is the customer\'s new age? '));
  customer.name = newName;
  customer.age = newAge;
  try {
    await customer.save();
    console.log('Customer updated successfully');
  } catch (err) {
    console.error('Error updating customer:', err.message);
  }
}

async function deleteCustomer() {
  console.log('Deleting a customer\n');
  await viewAllCustomers();
  const customerId = prompt('Copy and paste the id of the customer you would like to delete here: ');
  try {
    await Customer.findByIdAndDelete(customerId);
    console.log('Customer deleted successfully');
  } catch (err) {
    console.error('Error deleting customer:', err.message);
  }
}