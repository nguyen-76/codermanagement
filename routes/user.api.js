const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getTaskByUserId,
} = require("../controllers/user.controller.js");

/**
 * @route GET api/users
 * @description get list of user
 * @access public
 */
router.get("/", getAllUsers);

/**
 * @route GET api/users/
 * @description get task of user
 * @access public
 */

router.get("/:userId/tasks", getTaskByUserId);

/**
 * @route POST api/users
 * @description create a user
 * @access public
 */
router.post("/", createUser);

module.exports = router;
