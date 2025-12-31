import express from "express";
import {
  createCustomer,
  createProcedure,
  createMethod,
  createProcedureMethod,
  createSample,
  createProcedureSample,
  createMeasurement,
  createRole,
  updateCustomer,
  updateProcedure,
  updateMethod,
  updateProcedureMethod,
  updateSample,
  updateProcedureSample,
  updateMeasurement,
  updateRole,
  getCustomer,
  getProcedure,
  getMethod,
  getProcedureMethod,
  getSample,
  getProcedureSample,
  getMeasurement,
  getRole,
  getCustomers,
  getProcedures,
  getMethods,
  getProcedureMethods,
  getSamples,
  getProcedureSamples,
  getMeasurements,
  getRoles,
} from "../controllers/backend.js";
import {
  createUser,
  updateUser,
  getUsers,
  getUser,
} from "../controllers/user.js";

import { verifyAdmin } from "../utils/verify.js";

const router = express.Router(verifyAdmin);

// Create new record
router.post("/customers", createCustomer);
router.post("/procedures", createProcedure);
router.post("/methods", createMethod);
router.post("/procedureMethods", createProcedureMethod);
router.post("/samples", createSample);
router.post("/procedureSamples", createProcedureSample);
router.post("/measurements", createMeasurement);
router.post("/users", createUser);
router.post("/roles", createRole);

// Update record
router.put("/customers/:id", updateCustomer);
router.put("/procedures/:id", updateProcedure);
router.put("/methods/:id", updateMethod);
router.delete("/procedureMethods/:id", updateProcedureMethod);
router.put("/samples/:id", updateSample);
router.delete("/procedureSamples/:id", updateProcedureSample);
router.put("/measurements/:id", updateMeasurement);
router.put("/users/:id", updateUser);
router.put("/roles/:id", updateRole);

// Get all records
router.get("/customers", getCustomers);
router.get("/procedures", getProcedures);
router.get("/methods", getMethods);
router.get("/procedureMethods", getProcedureMethods);
router.get("/samples", getSamples);
router.get("/procedureSamples", getProcedureSamples);
router.get("/measurements", getMeasurements);
router.get("/users", getUsers);
router.get("/roles", getRoles);

// Get a record
router.get("/customers/:id", getCustomer);
router.get("/procedures/:id", getProcedure);
router.get("/methods/:id", getMethod);
router.get("/procedureMethods/:id", getProcedureMethod);
router.get("/samples/:id", getSample);
router.get("/procedureSamples/:id", getProcedureSample);
router.get("/measurements/:id", getMeasurement);
router.get("/users/:id", getUser);
router.get("/roles/:id", getRole);

export default router;
