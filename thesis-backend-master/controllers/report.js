import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

// Create new report
export const createReport = async (req, res, next) => {
  const {
    customer_id,
    samples_received_date,
    start_date,
    end_date,
    insertor_user_id,
    notes,
  } = req.body.data;

  //console.log(req.body.data);

  try {
    const result = await pool.query(
      "INSERT INTO thesis.report (customer_id, samples_received_date, start_date, end_date, insertor_user_id, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        customer_id,
        samples_received_date,
        start_date,
        end_date,
        insertor_user_id,
        notes,
      ]
    );

    res.json(result.rows);
    next();
  } catch (error) {
    next(error);
  }
};

export const createReportProcedure = async (req, res, next) => {
  const { id, procedureId, newMethodId, newSampleId, newMeasurementId } =
    req.body.data;

  try {
    const result = await pool.query(
      "INSERT INTO thesis.report_procedure_map (report_id, procedure_id, method_id, sample_id, measurement_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        id,
        procedureId,
        newMethodId || null,
        newSampleId,
        newMeasurementId || null,
      ]
    );

    res.json(result.rows);
    next();
  } catch (error) {
    next(error);
  }
};

// Update report
export const updateReport = async (req, res, next) => {
  const {
    customer_id,
    samples_received_date,
    start_date,
    end_date,
    generation_time,
    generator_user_id,
    notes,
    archived,
  } = req.body.data;

  try {
    const result = await pool.query(
      "UPDATE thesis.report SET customer_id = $1, samples_received_date = $2, start_date = $3, end_date = $4, generation_time = $5, generator_user_id = $6, notes = $7, archived = $8 WHERE report_id = $9 RETURNING *",
      [
        customer_id,
        samples_received_date || null,
        start_date || null,
        end_date || null,
        generation_time || null,
        generator_user_id || null,
        notes || null,
        archived || false,
        req.params.id,
      ]
    );

    res.json(result.data);
    next();
  } catch (error) {
    next(error);
  }
};

export const updateReportProcedure = async (req, res, next) => {
  const value = req.body.data;

  try {
    await pool.query(
      "UPDATE thesis.report_procedure_map SET value = $1 WHERE report_procedure_id = $2 RETURNING *",
      [value, req.params.id]
    );

    next();
  } catch (error) {
    next(error);
  }
};

// Get report by id
export const getReport = async (req, res, next) => {
  try {
    const report = await pool.query(
      "SELECT * FROM thesis.v_report WHERE id = $1",
      [req.params.id]
    );
    if (report) {
      res.send(report.rows);
      next();
    }
  } catch (error) {
    next(error);
  }
};

// Get report procedures
export const getReportProcedure = async (req, res, next) => {
  try {
    const report = await pool.query(
      "SELECT * FROM thesis.v_report_procedure_map WHERE report_id = $1",
      [req.params.id]
    );
    if (report) {
      res.send(report.rows);
      next();
    }
  } catch (error) {
    next(error);
  }
};

// Delete report procedure
export const deleteReportProcedure = async (req, res, next) => {
  try {
    const result = await pool.query(
      "DELETE FROM thesis.report_procedure_map WHERE report_procedure_id = $1 RETURNING *",
      [req.params.id]
    );

    res.json(result.data);
    next();
  } catch (error) {
    next(error);
  }
};

// Get all reports
export const getAllReports = async (req, res, next) => {
  try {
    const report = await pool.query("SELECT * FROM thesis.v_report");
    if (report) {
      res.send(report.rows);
      next();
    }
  } catch (error) {
    next(error);
  }
};
