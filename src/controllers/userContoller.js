const { createUser, getAllUsers, updateUser } = require('../Queries/userQuery');

// Controller function to create a new user
const createUserController = async (req, res) => {
  try {
    const userData = req.body;
    const results = await createUser(userData);
    res.status(201).json({ message: "User created successfully", userID: results.insertId });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to get all users
const getAllUsersController = async (req, res) => {
  try {
    const results = await getAllUsers();
    res.json(results);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to update a user by ID
const updateUserController = async (req, res) => {
  const userID = req.params.userID;
  const updatedUserData = req.body;

  try {
    const result = await updateUser(userID, updatedUserData);

    if (!result) {
      res.status(404).json({ message: `User with ID ${userID} not found` });
      return;
    }

    // Extract the new token from the result
    const { token } = result;

    // User updated successfully, send the new token in the response
    res.json({ message: `User with ID ${userID} updated successfully`, token: token });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createUserController,
  getAllUsersController,
  updateUserController
};
