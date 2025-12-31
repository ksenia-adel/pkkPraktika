import { createError } from "../utils/error.js";
import { pool } from "../db.js";

// Create new record
export const createCustomer = async (req, res, next) => {
  const {
    company_name,
    company_registration_code,
    company_address,
    customer_contact_person,
    customer_email,
    customer_phone,
  } = req.body.data;

  try {
    const result = await pool.query(
      "INSERT INTO thesis.customer (company_name, company_registration_code, company_address, customer_contact_person, customer_email, customer_phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        company_name,
        company_registration_code,
        company_address,
        customer_contact_person,
        customer_email,
        customer_phone,
      ]
    );
    res.json(result.data);
    next();
  } catch (error) {
    next(error);
  }
};

export const createProcedure = async (req, res, next) => {
  const { name_est, name_eng } = req.body.data;

  try {
    const result = await pool.query(
      "INSERT INTO thesis.procedure (name_est, name_eng) VALUES ($1, $2) RETURNING *",
      [name_est, name_eng]
    );

    res.json(result.data);
    next();
  } catch (error) {
    next(error);
  }
};

export const createMethod = async (req, res, next) => {
  const { name, accredited } = req.body.data;

  try {
    const result = await pool.query(
      "INSERT INTO thesis.method (name, accredited) VALUES ($1, $2) RETURNING *",
      [name, accredited === "Jah" ? true : false]
    );

    res.json(result.data);
    next();
  } catch (error) {
    next(error);
  }
};

export const createProcedureMethod = async (req, res, next) => {
  const { procedure_id, second_id: method_id } = req.body.data;

  try {
    const result = await pool.query(
      "INSERT INTO thesis.procedure_method_map (procedure_id, method_id) VALUES ($1, $2) RETURNING *",
      [procedure_id, method_id]
    );

    res.json(result.data);
    next();
  } catch (error) {
    next(error);
  }
};

export const createSample = async (req, res, next) => {
  const { name_est, name_eng } = req.body.data;

  try {
    const result = await pool.query(
      "INSERT INTO thesis.sample (name_est, name_eng) VALUES ($1, $2) RETURNING *",
      [name_est, name_eng]
    );

    res.json(result.data);
    next();
  } catch (error) {
    next(error);
  }
};

export const createProcedureSample = async (req, res, next) => {
  const { procedure_id, second_id: sample_id } = req.body.data;

  try {
    const result = await pool.query(
      "INSERT INTO thesis.procedure_sample_map (procedure_id, sample_id) VALUES ($1, $2) RETURNING *",
      [procedure_id, sample_id]
    );

    res.json(result.data);
    next();
  } catch (error) {
    next(error);
  }
};

export const createMeasurement = async (req, res, next) => {
  const { unit } = req.body.data;

  try {
    const result = await pool.query(
      "INSERT INTO thesis.measurement (unit) VALUES ($1) RETURNING *",
      [unit]
    );

    res.json(result.data);
    next();
  } catch (error) {
    next(error);
  }
};

export const createRole = async (req, res, next) => {
  const { name, comment } = req.body.data;
  try {
    const result = await pool.query(
      "INSERT INTO thesis.role (name, comment) VALUES ($1, $2) RETURNING *",
      [name, comment]
    );

    res.json(result.data);
    next();
  } catch (error) {
    next(error);
  }
};

// Update record
export const updateCustomer = async (req, res, next) => {
  const {
    company_name,
    company_registration_code,
    company_address,
    customer_contact_person,
    customer_email,
    customer_phone,
    archived,
  } = req.body.data;

  try {
    const result = await pool.query(
      "UPDATE thesis.customer SET company_name = $1, company_registration_code = $2, company_address = $3, customer_contact_person = $4, customer_email = $5, customer_phone = $6, archived = $7 WHERE customer_id = $8 RETURNING *",
      [
        company_name,
        company_registration_code,
        company_address,
        customer_contact_person,
        customer_email,
        customer_phone,
        archived,
        req.params.id,
      ]
    );

    res.json(result.data);
    next();
  } catch (error) {
    next(error);
  }
};

export const updateProcedure = async (req, res, next) => {
  const { name_est, name_eng, archived } = req.body.data;

  try {
    const result = await pool.query(
      "UPDATE thesis.procedure SET name_est = $1, name_eng = $2, archived = $3 WHERE procedure_id = $4 RETURNING *",
      [name_est, name_eng, archived, req.params.id]
    );

    res.json(result.data);
    next();
  } catch (error) {
    next(error);
  }
};

export const updateMethod = async (req, res, next) => {
  const { name, accredited, archived } = req.body.data;

  try {
    const result = await pool.query(
      "UPDATE thesis.method SET name = $1, accredited = $2, archived = $3 WHERE method_id = $4 RETURNING *",
      [name, accredited === "Jah" ? true : false, archived, req.params.id]
    );

    res.json(result.data);
    next();
  } catch (error) {
    next(error);
  }
};

export const updateProcedureMethod = async (req, res, next) => {
  const method_id = req.body.second_id;

  try {
    const result = await pool.query(
      "DELETE FROM thesis.procedure_method_map WHERE procedure_id = $1 AND method_id = $2 RETURNING *",
      [req.params.id, method_id]
    );

    res.json(result.data);
    next();
  } catch (error) {
    next(error);
  }
};

export const updateSample = async (req, res, next) => {
  const { name_est, name_eng, archived } = req.body.data;

  try {
    const result = await pool.query(
      "UPDATE thesis.sample SET name_est = $1, name_eng = $2, archived = $3 WHERE sample_id = $4 RETURNING *",
      [name_est, name_eng, archived, req.params.id]
    );

    res.json(result.data);
    next();
  } catch (error) {
    next(error);
  }
};

export const updateProcedureSample = async (req, res, next) => {
  const sample_id = req.body.second_id;

  try {
    const result = await pool.query(
      "DELETE FROM thesis.procedure_sample_map WHERE procedure_id = $1 AND sample_id = $2 RETURNING *",
      [req.params.id, sample_id]
    );

    res.json(result.data);
    next();
  } catch (error) {
    next(error);
  }
};

export const updateMeasurement = async (req, res, next) => {
  const { unit } = req.body.data;

  try {
    const result = await pool.query(
      "UPDATE thesis.measurement SET unit = $1 WHERE measurement_id = $2 RETURNING *",
      [unit, req.params.id]
    );

    res.json(result.data);
    next();
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req, res, next) => {
  const { name, comment, archived } = req.body.data;

  try {
    const result = await pool.query(
      "UPDATE thesis.role SET name = $1, comment = $2, archived = $3 WHERE role_id = $4 RETURNING *",
      [name, comment, archived, req.params.id]
    );

    res.json(result.data);
    next();
  } catch (error) {
    next(error);
  }
};

// Get a record
export const getCustomer = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM thesis.v_customer WHERE id = $1",
      [req.params.id]
    );
    if (result) {
      res.send(result.rows);
      next();
    }
  } catch (error) {
    next(error);
  }
};

export const getProcedure = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM thesis.v_procedure WHERE id = $1",
      [req.params.id]
    );
    if (result) {
      res.send(result.rows);
      next();
    }
  } catch (error) {
    next(error);
  }
};

export const getMethod = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM thesis.v_method WHERE id = $1",
      [req.params.id]
    );
    if (result) {
      res.send(result.rows);
      next();
    }
  } catch (error) {
    next(error);
  }
};

export const getProcedureMethod = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM thesis.v_procedure_method_map WHERE procedure_id = $1",
      [req.params.id]
    );
    if (result) {
      res.send(result.rows);
      next();
    }
  } catch (error) {
    next(error);
  }
};

export const getSample = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM thesis.v_sample WHERE id = $1",
      [req.params.id]
    );
    if (result) {
      res.send(result.rows);
      next();
    }
  } catch (error) {
    next(error);
  }
};

export const getProcedureSample = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM thesis.v_procedure_sample_map WHERE procedure_id = $1",
      [req.params.id]
    );
    if (result) {
      res.send(result.rows);
      next();
    }
  } catch (error) {
    next(error);
  }
};

export const getMeasurement = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM thesis.v_measurement WHERE id = $1",
      [req.params.id]
    );
    if (result) {
      res.send(result.rows);
      next();
    }
  } catch (error) {
    next(error);
  }
};

export const getRole = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM thesis.v_role WHERE id = $1",
      [req.params.id]
    );
    if (result) {
      res.send(result.rows);
      next();
    }
  } catch (error) {
    next(error);
  }
};

// Get all records
export const getCustomers = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM thesis.v_customer");
    if (result) {
      res.send(result.rows);
      next();
    }
  } catch (error) {
    next(error);
  }
};

export const getProcedures = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM thesis.v_procedure");
    if (result) {
      res.send(result.rows);
      next();
    }
  } catch (error) {
    next(error);
  }
};

export const getMethods = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM thesis.v_method");
    if (result) {
      res.send(result.rows);
      next();
    }
  } catch (error) {
    next(error);
  }
};

export const getProcedureMethods = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM thesis.v_procedure_method_map"
    );
    if (result) {
      res.send(result.rows);
      next();
    }
  } catch (error) {
    next(error);
  }
};

export const getSamples = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM thesis.v_sample");
    if (result) {
      res.send(result.rows);
      next();
    }
  } catch (error) {
    next(error);
  }
};

export const getProcedureSamples = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM thesis.v_procedure_sample_map"
    );
    if (result) {
      res.send(result.rows);
      next();
    }
  } catch (error) {
    next(error);
  }
};

export const getMeasurements = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM thesis.v_measurement");
    if (result) {
      res.send(result.rows);
      next();
    }
  } catch (error) {
    next(error);
  }
};

export const getRoles = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM thesis.v_role");
    if (result) {
      res.send(result.rows);
      next();
    }
  } catch (error) {
    next(error);
  }
};
