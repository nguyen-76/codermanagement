const { sendResponse, AppError } = require("../helpers/utils.js");
const Task = require("../models/Task.js");
const ObjectId = require("mongoose").Types.ObjectId;

const taskController = {};

taskController.createTask = async (req, res, next) => {
  //in real project you will getting info from req
  const info = req.body;

  try {
    //always remember to control your inputs
    //check if body exist
    if (!info.title || !info.description)
      throw new AppError(402, "Bad Request", "Create Task Error");
    //check if required fields exist
    const taskExisted = await Task.findOne({ name: info.title });
    if (taskExisted) {
      throw new AppError(400, "Bad request", "Task is existed");
    }

    //in real project you must also check if id (referenceTo) is valid as well as if document with given id is exist before any futher process
    //mongoose query
    const created = await Task.create(info);
    sendResponse(
      res,
      200,
      true,
      { data: created },
      null,
      "Create Task Success"
    );
  } catch (err) {
    next(err);
  }
};

taskController.getAllTasks = async (req, res, next) => {
  //in real project you will getting condition from from req then construct the filter object for query
  // empty filter mean get all
  let { status, ...sort } = req.query;
  let filter = { isDeleted: false };
  const allowedSort = ["createdAt", "updatedAt"];
  const sortKeys = Object.keys(sort);
  try {
    const pipeline = [];
    if (!!status) {
      filter = { status };
      pipeline.push({ $match: filter });
    } else {
      pipeline.push({ $match: { status: { $not: { $regex: "deleted" } } } });
    }
    if (sort == {}) {
      sortKeys.forEach((key) => {
        if (!allowedSort.includes(key)) {
          throw new AppError(402, "Bad Request", "Create Task Error");
        }
      });
      sortKeys.forEach((key) => {
        switch (sort[key]) {
          case "asc":
            sort[key] = 1;
            break;
          case "des":
            sort[key] = -1;
            break;
          default:
            break;
        }
      });
      pipeline.push({ $sort: sort });
    }

    //mongoose query
    const listOfFound = await Task.aggregate(pipeline);

    //this to query data from the reference and append to found result.
    sendResponse(
      res,
      200,
      true,
      { data: listOfFound },
      null,
      "Found list of tasks success"
    );
  } catch (err) {
    next(err);
  }
};

taskController.updateTaskById = async (req, res, next) => {
  //in real project you will getting id from req. For updating and deleting, it is recommended for you to use unique identifier such as _id to avoid duplication
  //you will also get updateInfo from req
  // empty target and info mean update nothing
  const { taskId } = req.params;
  const { status } = req.body;

  const allowedStatus = ["pending", "working", "review", "done", "archive"];
  try {
    if (!ObjectId.isValid(taskId))
      throw new AppError(400, "Invalid ObjectId", "Bad request");
    if (!status)
      throw new AppError(402, "Bad Request", "Please provide new status");
    if (!allowedStatus.includes(status)) {
      throw new AppError(402, "Bad Request", "Please provide correct status");
    }

    const found = await Task.findById(taskId);
    if (!found) {
      throw new AppError(404, "Bad Request", "Task not found");
    }
    if (found.status === "done" && status !== "archive") {
      throw new AppError(
        402,
        "Bad Request",
        "This task could only be archived"
      );
    }
    if (found.status === "archive" && status !== "archive") {
      throw new AppError(402, "Bad Request", "This task has been archived");
    }
    if (found.status === "deleted") {
      throw new AppError(404, "Bad Request", "Task not found");
    }
    found.status = status;
    await found.save();

    sendResponse(res, 200, true, { data: found }, null, "Found task success");
  } catch (error) {
    next(error);
  }
};

taskController.deleteTaskById = async (req, res, next) => {
  //in real project you will getting id from req. For updating and deleting, it is recommended for you to use unique identifier such as _id to avoid duplication

  // empty target mean delete nothing
  const { taskId } = req.params;
  try {
    if (!ObjectId.isValid(taskId))
      throw new AppError(400, "Invalid ObjectId", "Bad request");
    const found = await Task.findById(taskId);
    if (!found) {
      throw new AppError(404, "Bad Request", "Task not found");
    }
    if (found.status === "deleted") {
      throw new AppError(404, "Bad Request", "Task not found");
    }
    found.status = "deleted";
    await found.save();
    sendResponse(res, 200, true, { data: found }, null, "Found task success");
  } catch (error) {
    next(error);
  }
};

taskController.getTaskById = async (req, res, next) => {
  const { taskId } = req.params;
  try {
    if (!ObjectId.isValid(taskId))
      throw new AppError(400, "Invalid ObjectId", "Bad request");

    const found = await Task.findById(taskId);
    if (!found) {
      throw new AppError(404, "Bad Request", "Task not found");
    }
    if (found.status === "deleted") {
      throw new AppError(404, "Bad Request", "Task not found");
    }
    sendResponse(res, 200, true, { data: found }, null, "Found task success");
  } catch (error) {
    next(error);
  }
};

taskController.addAssignee = async (req, res, next) => {
  const { taskId } = req.params;
  const { userId, option } = req.body;
  try {
    if (!ObjectId.isValid(taskId))
      throw new AppError(400, "Invalid ObjectId", "Bad request");
    let found = await Task.findById(taskId);
    if (!found) {
      throw new AppError(404, "Bad Request", "Task not found");
    }
    const refFound = await User.findById(userId);
    if (!refFound) {
      throw new AppError(404, "Bad Request", "User not found");
    }
    if (option) {
      switch (option) {
        case "add":
          if (found.assignee) {
            throw new AppError(404, "Bad Request", "Already assigned");
          }
          found.assignee = userId;
          await found.save();
          sendResponse(
            res,
            200,
            true,
            { data: found },
            null,
            "Add assignee success"
          );
          break;
        case "delete":
          if (!found.assignee) {
            throw new AppError(
              404,
              "Bad Request",
              "Task has not been assigned yet"
            );
          } else {
            found.assignee = undefined;
            await found.save();
            sendResponse(
              res,
              200,
              true,
              { data: found },
              null,
              "Delete assignee success"
            );
          }

          break;
        default:
          throw new AppError(
            404,
            "Bad Request",
            "Please provide correct option"
          );
      }
    } else {
      throw new AppError(404, "Bad Request", "Please provide option");
    }
  } catch (err) {
    next(err);
  }
};
module.exports = taskController;
