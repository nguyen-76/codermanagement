const express = require("express");
const {
  getAllUsers,
  createUser,
  updateUserById,
  deleteUserById,
} = require("../controllers/user.controller");
const router = express.Router();

/**
 * @route GET api/users
 * @description Get a list of users
 * @access private
 * @allowedQueries: name
 */
router.get("/", getAllUsers);

/**
 * @route POST api/users
 * @description Create a new user
 * @access private, manager
 * @requiredBody: name
 */
router.post("/", createUser);

router.put("/:id", updateUserById);

router.delete("/:id", deleteUserById);

/**
 * @route GET api/users/:id
 * @description Get user by id
 * @access public
 */

module.exports = router;
