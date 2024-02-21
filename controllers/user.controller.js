const {
  sendResponse,
  AppError,
  firstLetterCapital,
} = require("../helpers/utils.js");
const User = require("../models/User.js");
const Task = require("../models/Task.js");
const allowedRole = ["manager", "employee"];
const userController = {};

userController.createUser = async (req, res, next) => {
  //in real project you will getting info from req
  const info = req.body;

  try {
    //always remember to control your inputs
    if (!info || !allowedRole.includes(info.role))
      throw new AppError(402, "Bad Request", "Create User Error");
    if (info.role === "") info.role = "employee";
    const userExist = await User.find({ name: info.name });
    if (!!userExist[0]) {
      throw new AppError(402, "Bad Request", "Username exist");
    }
    if (info)
      if (typeof info.name !== "string")
        info.name = firstLetterCapital(`${info.name}`);
    const created = await User.create(info);
    sendResponse(
      res,
      200,
      true,
      { data: created },
      null,
      "Create User Success"
    );
  } catch (err) {
    next(err);
  }
};

userController.getAllUsers = async (req, res, next) => {
  //in real project you will getting condition from from req then construct the filter object for query
  // empty filter mean get all
  let filter = req.query;

  try {
    let pipeline = [];
    let listOfFound;

    if (!filter.name && !filter.role) {
      listOfFound = await User.find(filter);
    } else {
      pipeline.push({
        $match: {},
      });
      if (filter.name) {
        filter.name = firstLetterCapital(filter.name);
        pipeline[0].$match.name = { $regex: filter.name, $options: "i" };
      }
      if (filter.role) {
        if (!allowedRole.includes(filter.role)) {
          throw new AppError(
            402,
            "Bad Request",
            "Please provide the correct role"
          );
        }
        pipeline[0].$match.role = filter.role;
      }
      listOfFound = await User.aggregate(pipeline);
    }

    sendResponse(
      res,
      200,
      true,
      { data: listOfFound },
      null,
      "Found list of users success"
    );
  } catch (err) {
    next(err);
  }
};
userController.getTaskByUserId = async (req, res, next) => {
  //in real project you will getting info from req
  const { userId } = req.params;

  try {
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      throw new AppError(404, "Bad Request", "User not found");
    }
    let foundUserTasks = await Task.find({
      assignee: userId,
      status: { $not: { $regex: "deleted" } },
    }).select("-assignee");
    foundUser._doc.tasks = foundUserTasks;
    console.log(foundUser);

    sendResponse(
      res,
      200,
      true,
      { user: foundUser },
      null,
      "Get Tasks success"
    );
  } catch (err) {
    next(err);
  }
};

module.exports = userController;
