const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: { type: String, trim: true, maxlength: 500, default: "" },
    status: {
      type: String,
      enum: { values: ["pending", "in-progress", "completed"], message: "Invalid status" },
      default: "pending",
    },
    priority: {
      type: String,
      enum: { values: ["low", "medium", "high"], message: "Invalid priority" },
      default: "medium",
    },
    dueDate: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
