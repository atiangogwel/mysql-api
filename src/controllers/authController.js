const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../jwtConfig');
const { authenticateUser } = require('../Queries/authQuery');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser(email, password);

    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication failed' });
      return;
    }

    // Include last_name and first_name in the JWT payload
    const tokenPayload = {
      userID: user.userID,
      last_name: user.last_name,
      first_name: user.first_name
    };

    // Generate JWT token using the secret key from jwtConfig.js
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

    // Authentication successful, send token in response
    res.json({ success: true, message: 'Login successful', token });
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
const logoutUser = (req, res) => {
  try {
    // Clear session (local storage) by removing the token
    res.clearCookie('token').json({ success: true, message: 'Logout successful' });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


module.exports = {
  loginUser,logoutUser
};
