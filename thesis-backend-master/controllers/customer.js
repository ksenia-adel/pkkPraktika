import { createError } from "../utils/error.js";
import { pool } from "../db.js";

// Create new customer
export const createCustomer = async (req, res, next) => {
  try {
  } catch (error) {}
};

// Update customer
export const updateCustomer = async (req, res, next) => {
  try {
  } catch (error) {}
};

// Get customer by id
export const getCustomer = async (req, res, next) => {
  try {
    const customer = await pool.query(
      "SELECT * FROM thesis.customer WHERE customer_id = $1",
      [req.params.id]
    );
    if (customer) {
      res.send(customer.rows);
      next();
    }
  } catch (error) {
    next(error);
  }
};

// Get all customers
export const getCustomers = async (req, res, next) => {
  try {
    const customers = await pool.query("SELECT * FROM thesis.customer");
    if (customers) {
      res.send(customers.rows);
      next();
    }
  } catch (error) {
    next(error);
  }
};
