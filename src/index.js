const express = require('express');
const bodyParser = require('body-parser');
const recipeRoutes = require('./routes/recipeRoutes');
const { handleErrors } = require('./middleware/errorMiddleware');

const app = express();
const port = 3009;

app.use(bodyParser.json());

// Routes
app.use(recipeRoutes);

// Error handling middleware
app.use(handleErrors);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
