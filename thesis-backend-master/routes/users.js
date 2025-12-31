import express from "express";
import {
  createUser,
  updateUser,
  getUser,
  getUsers,
} from "../controllers/user.js";

import { verifyAdmin, verifyUser } from "../utils/verify.js";

const router = express.Router();

// CREATE
router.post("/create", verifyAdmin, createUser);

// UPDATE - includes deleting (deactivating)
router.put("/:id", verifyUser, updateUser);

// GET
router.get("/:id", verifyUser, getUser);

// GET ALL
router.get("/", verifyAdmin, getUsers);

export default router;
