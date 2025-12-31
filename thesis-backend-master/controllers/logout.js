import { createError } from "../utils/error.js";

export const logout = async (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.jwt)
    return next(createError(204, "Juurdepääsu tokenit ei leitud"));

  res.clearCookie("jwt", { httpOnly: true });
  res.sendStatus(204);
  return next();
};
