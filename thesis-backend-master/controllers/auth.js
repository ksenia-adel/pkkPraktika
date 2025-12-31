import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";
import { pool } from "../db.js";

// Login user
export const login = async (req, res, next) => {
  try {
    // User validation
    // Validate username
    const user = await pool.query(
      "SELECT * FROM thesis.user WHERE username = $1::TEXT AND active = TRUE",
      [req.body.username]
    );

    const userData = user.rows[0];
    //console.log(userData);
    if (!userData) return next(createError(404, "Kasutajat ei eksisteeri!"));

    // Validate user password
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      userData.password
    );

    if (!isPasswordCorrect)
      return next(createError(400, "Vale kasutajanimi või parool!"));

    // Generate JWT tokens - expires in 5 minutes
    const accessToken = jwt.sign(
      { id: userData.user_id, isAdmin: userData.role_id === 1 },
      process.env.JWT_ACCESS,
      { expiresIn: "5m" }
    );
    const refreshToken = jwt.sign(
      { id: userData.user_id, isAdmin: userData.role_id === 1 },
      process.env.JWT_REFRESH,
      { expiresIn: "1d" }
    );

    // Deconstruct data
    const { password, role_id, ...otherDetails } = userData;

    // Add JWT token to cookie
    res
      .cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        details: { ...otherDetails, accessToken, is_admin: role_id === 1 },
      });
    console.log(`User "${req.body.username}" logged in!`);
  } catch (error) {
    console.log(error);
  }
};
