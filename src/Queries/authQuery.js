const pool = require('../dbConfig');
const bcrypt = require('bcrypt');

// Function to authenticate user login
const authenticateUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    pool.query(query, [email], (error, results) => {
      if (error) {
        reject(error);
        return;
      }

      if (results.length === 0) {
        // User with the provided email does not exist
        resolve(null);
        return;
      }

      const user = results[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (err || !result) {
          // Incorrect password
          resolve(null);
          return;
        }
        // Password is correct, return the user data
        resolve(user);
      });
    });
  });
};

module.exports = {
  authenticateUser
};
