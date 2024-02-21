const express = require("express");
const {
  getAllTasks,
  createTask,
  updateTaskById,
  deleteTaskById,
} = require("../controllers/task.controller");
const router = express.Router();

router.get("/", getAllTasks);

router.post("/", createTask);

router.put("/:id", updateTaskById);

router.delete("/:id", deleteTaskById);

module.exports = router;
