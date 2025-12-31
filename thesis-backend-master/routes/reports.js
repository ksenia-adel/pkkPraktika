import express from "express";
import {
  createReport,
  createReportProcedure,
  updateReport,
  updateReportProcedure,
  getReport,
  getReportProcedure,
  getAllReports,
  deleteReportProcedure,
} from "../controllers/report.js";

import { verifyAdmin, verifyUser } from "../utils/verify.js";

const router = express.Router();

// CREATE
router.post("/", createReport);
router.post("/reportProcedures", createReportProcedure);

// UPDATE
router.put("/:id", updateReport);
router.put("/reportProcedures/:id", verifyUser, updateReportProcedure);

// GET
router.get("/:id", verifyUser, getReport);
router.get("/reportProcedures/:id", verifyUser, getReportProcedure);

// GET ALL
router.get("/", verifyUser, getAllReports);

// DELETE
router.delete("/reportProcedures/:id", verifyUser, deleteReportProcedure);

export default router;
