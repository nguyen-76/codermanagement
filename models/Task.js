const mongoose = require("mongoose");
//Create schema
const taskSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["pending", "working", "review", "done", "archive", "deleted"],
    },

    assignee: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
