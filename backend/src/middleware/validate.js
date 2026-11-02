const mongoose = require("mongoose");
const { AppError } = require("./errorHandler");

const STATUSES = ["pending", "in-progress", "completed"];
const PRIORITIES = ["low", "medium", "high"];

const validateId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError("Invalid task id", 400));
  }
  next();
};

const validateTaskBody = (isUpdate = false) => (req, res, next) => {
  const body = req.body || {};
  const { title, status, priority, dueDate } = body;
  const errors = [];

  if (!isUpdate && (typeof title !== "string" || !title.trim())) errors.push("Title is required");
  if (isUpdate && title !== undefined && (typeof title !== "string" || !title.trim()))
    errors.push("Title cannot be empty");
  if (status !== undefined && !STATUSES.includes(status))
    errors.push(`Status must be one of: ${STATUSES.join(", ")}`);
  if (priority !== undefined && !PRIORITIES.includes(priority))
    errors.push(`Priority must be one of: ${PRIORITIES.join(", ")}`);
  if (dueDate && Number.isNaN(Date.parse(dueDate))) errors.push("Invalid dueDate");
  if (isUpdate && !Object.keys(body).length) errors.push("Request body is empty");

  if (errors.length) return next(new AppError(errors.join(", "), 400));
  next();
};

const validateStatusBody = (req, res, next) => {
  const status = req.body && req.body.status;
  if (!STATUSES.includes(status))
    return next(new AppError(`Status must be one of: ${STATUSES.join(", ")}`, 400));
  next();
};

module.exports = { validateId, validateTaskBody, validateStatusBody };
