import express from "express";
import {
  createCustomer,
  updateCustomer,
  getCustomer,
  getCustomers,
} from "../controllers/customer.js";

import { verifyAdmin, verifyUser } from "../utils/verify.js";

const router = express.Router();

// CREATE
router.post("/create", verifyAdmin, createCustomer);

// UPDATE
router.put("/:id", verifyAdmin, updateCustomer);

// GET
router.get("/:id", verifyUser, getCustomer);

// GET ALL
router.get("/", verifyUser, getCustomers);

export default router;
