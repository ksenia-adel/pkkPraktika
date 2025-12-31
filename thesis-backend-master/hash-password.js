// hash_password.js
import bcrypt from "bcryptjs";

// Получает пароль из аргументов: node hash_password.js mypassword
const pwd = process.argv[2];

if (!pwd) {
  console.error("Usage: node hash_password.js <password>");
  process.exit(1);
}

const saltRounds = 10;

bcrypt.genSalt(saltRounds, (err, salt) => {
  if (err) throw err;
  bcrypt.hash(pwd, salt, (err2, hash) => {
    if (err2) throw err2;
    console.log("BCRYPT HASH:");
    console.log(hash);
  });
});
