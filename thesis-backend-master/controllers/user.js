import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

// Create new user
export const createUser = async (req, res, next) => {
  function generatePassword(user) {
    let newDate = new Date();
    let year = newDate.getFullYear();

    const pass = user + year;
    return pass;
  }

  const {
    username,
    firstname,
    lastname,
    email,
    profession,
    address,
    role_id,
    role_grantor_user_id,
  } = req.body.data;

  try {
    const password = generatePassword(username);
    console.log(password);
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO thesis.user (username, password, firstname, lastname, email, profession, address, role_id, role_grantor_user_id, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE) RETURNING *",
      [
        username,
        hash,
        firstname,
        lastname,
        email,
        profession,
        address,
        role_id,
        role_grantor_user_id,
      ]
    );

    res.json(newUser.rows[0]);
    next();
  } catch (error) {
    next(error);
  }
};

// Update user
export const updateUser = async (req, res, next) => {
  const { username, firstname, lastname, email, profession, address, role_id } =
    req.body.data;

  if (req.body.data.password && req.body.data.password !== "") {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(req.body.data.password, salt);
    try {
      await pool.query(
        "UPDATE thesis.user SET password = $1 WHERE user_id = $2",
        [hash, req.params.id]
      );
    } catch (error) {
      next(error);
    }
  }

  try {
    const updatedUser = await pool.query(
      "UPDATE thesis.user SET username = $1, firstname = $2, lastname = $3, email = $4, profession = $5, address = $6, role_id = $7 WHERE user_id = $8 RETURNING *",
      [
        username,
        firstname,
        lastname,
        email,
        profession,
        address,
        role_id,
        req.params.id,
      ]
    );

    res.json(updatedUser.rows[0]);
    next();
  } catch (error) {
    next(error);
  }
};

// Get user by user id
export const getUser = async (req, res, next) => {
  try {
    const user = await pool.query("SELECT * FROM thesis.v_user WHERE id = $1", [
      req.params.id,
    ]);
    if (user) {
      res.send(user.rows);
      next();
    }
  } catch (error) {
    next(error);
  }
};

// Get all users
export const getUsers = async (req, res, next) => {
  try {
    const user = await pool.query("SELECT * FROM thesis.v_user");
    if (user) {
      res.send(user.rows);
      next();
    }
  } catch (error) {
    next(error);
  }
};
