const express = require("express");
const router = express.Router();
const {
  createTask,
  getAllTasks,
  addAssignee,
  getTaskById,
  updateTaskStatusById,
  deleteTaskById,
} = require("../controllers/task.controller.js");

/**
 * @route GET api/tasks
 * @description get list of task
 * @access public
 */
router.get("/", getAllTasks);

/**
 * @route GET api/tasks
 * @description get list of task by id
 * @access public
 */
router.get("/:taskId", getTaskById);

//Create
/**
 * @route POST api/tasks
 * @description create a task
 * @access public
 */
router.post("/", createTask);

//Update
/**
 * @route PUT api/tasks
 * @description add people into a task
 * @access public
 */
router.put("/assign/:taskId", addAssignee);

//Update
/**
 * @route PUT api/tasks
 * @description update reference to a task
 * @access public
 */
router.put("/:taskId", updateTaskById);

//delete
/**
 * @route PUT api/tasks
 * @description delete  a task
 * @access public
 */
router.delete("/:taskId", deleteTaskById);

module.exports = router;
