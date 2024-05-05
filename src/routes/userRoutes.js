const express = require('express');
const router = express.Router();

const {createUserController,getAllUsersController, getUserByIdController,updateUserController, deleteUserController } = require('../controllers/userContoller');


router.post('/users', createUserController);
router.get('/users', getAllUsersController);
router.patch('/users/update/:userID', updateUserController);

module.exports = router;
