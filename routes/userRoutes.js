const express = require('express');
const {registerUser, loginUser, createIssue, addComments, getAllIssues, addLike, getAllUsers} = require('../controllers/userController.js')
const { protect} = require('../middlewares/authMiddleware')


const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/issue').post(protect, createIssue).get(getAllIssues);
router.route('/issue/:id').put(protect, addComments)
router.route('/issue/:id/addlike').get(protect,addLike)
router.route('/').get(getAllUsers)


module.exports = router