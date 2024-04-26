const mongoose = require("mongoose");
const dotenv = require("dotenv");
const prompt = require("prompt-sync")();
const Customer = require("./models/customer");

dotenv.config();

mongoose.connect(process.env.MONGODB_URI,)
  .then(() => {
    console.log('Connected to MongoDB');
    startApp();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

// Load Customer Model

const displayMenu = () => {
  console.log("What would you like to do?");
  console.log(" 1. Create a new customer");
  console.log(" 2. View all customers");
  console.log(" 3. Update a customer");
  console.log(" 4. Delete a customer");
  console.log(" 5. Exit");
};

const createCustomer = async () => {
  console.log("Creating a new customer\n");
  const name = prompt("Enter customer name: ");
  const age = parseInt(prompt("Enter customer age: "));
  const customer = new Customer({ name, age });
  try {
      await customer.save();
      console.log("Customer successfully created!");
  } catch (err) {
      console.error("Error creating customer:", err.message);
  }
};

const viewCustomers = async () => {
  console.log("Viewing all customers\n");
  try {
      const customers = await Customer.find();
      customers.forEach((customer) => {
          console.log(
              `id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`
          );
      });
  } catch (err) {
      console.error("Error fetching customers:", err.message);
  }
};

const updateCustomer = async () => {
  console.log("Updating a customer\n");
  await viewCustomers();
  const customerId = prompt("Copy and paste the id of the customer to update here: ");
  const newName = prompt("What is the customer's new name? ");
  const newAge = parseInt(prompt("What is the customer's new age? "));
  try {
      await Customer.findByIdAndUpdate(customerId, {
          name: newName,
          age: newAge,
      });
      console.log("Customer successfully updated!");
  } catch (err) {
      console.error("Error updating customer:", err.message);
  }
};

const deleteCustomer = async () => {
  console.log("Deleting a customer\n");
  await viewCustomers();
  const customerId = prompt("Copy and paste the id of the customer to delete here: ");
  try {
      await Customer.findByIdAndDelete(customerId);
      console.log("Customer successfully deleted!");
  } catch (err) {
      console.error("Error deleting customer:", err.message);
  }
};

const startApp = async () => {
  console.log("Welcome to the CRM");

  while (true) {
      displayMenu();
      const choice = parseInt(prompt("Number of action to run: "));

      switch (choice) {
          case 1:
              await createCustomer();
              break;
          case 2:
              await viewCustomers();
              break;
          case 3:
              await updateCustomer();
              break;
          case 4:
              await deleteCustomer();
              break;
          case 5:
              console.log("Exiting...");
              mongoose.connection.close();
              process.exit(0);
          default:
              console.log("Invalid choice. Please try again.");
      }
      console.log();
  }
};