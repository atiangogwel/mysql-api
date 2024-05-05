const pool = require('../dbConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../jwtConfig');

// Create the users table if it does not exist
const createUserTable = async () => {
  const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      userID INT AUTO_INCREMENT PRIMARY KEY,
      last_name VARCHAR(255) NOT NULL,
      first_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `;

  try {
    await pool.query(createUserTableQuery);
    console.log('Users table created or already exists');
  } catch (error) {
    console.error('Error creating users table:', error);
  }
};

// Function to create a new user
const createUser = (userData) => {
  const { last_name, first_name, email, password } = userData;
  
  return new Promise((resolve, reject) => {
    // Generate a salt and hash the password
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(err);
        return;
      }

      // Store the hashed password in the database
      const query = 'INSERT INTO users (last_name, first_name, email, password) VALUES (?, ?, ?, ?)';
      pool.query(query, [last_name, first_name, email, hash], (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  });
};

// Function to get all users
const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users';
    pool.query(query, (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
};

// Function to update a user by ID
const updateUser = (userID, updatedUserData) => {
  // Extract updated fields from updatedUserData
  const { last_name, first_name, email, password } = updatedUserData;

  return new Promise((resolve, reject) => {
    if (!last_name && !first_name && !email && !password) {
      reject(new Error('No fields provided for update.'));
      return;
    }

    // Construct the SQL query based on provided fields
    let query = 'UPDATE users SET';
    const params = [];
    if (last_name) {
      query += ' last_name = ?,';
      params.push(last_name);
    }
    if (first_name) {
      query += ' first_name = ?,';
      params.push(first_name);
    }
    if (email) {
      query += ' email = ?,';
      params.push(email);
    }
    if (password) {
      // Hash the password using bcrypt
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          reject(err);
          return;
        }
        query += ' password = ?,';
        params.push(hash);
        // Remove the trailing comma from the query string
        query = query.slice(0, -1);
        query += ' WHERE userID = ?';
        params.push(userID);
        // Execute the query
        pool.query(query, params, (error, results) => {
          if (error) {
            reject(error);
            return;
          }
          // If the user was successfully updated, generate a new JWT token
          const token = jwt.sign({ userID: userID }, JWT_SECRET, { expiresIn: '1h' });
          resolve({ results, token }); 
        });
      });
    } else {
      query = query.slice(0, -1);
      query += ' WHERE userID = ?';
      params.push(userID);
      // Execute the query
      pool.query(query, params, (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        // If the user was successfully updated, generate a new JWT token
        const token = jwt.sign({ userID: userID }, JWT_SECRET, { expiresIn: '1h' });
        resolve({ results, token }); 
      });
    }
  });
};


createUserTable();
module.exports = {
  createUser,
  getAllUsers,
  updateUser
};
