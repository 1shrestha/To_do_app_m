const Task = require("../models/Task");
const { AppError } = require("../middleware/errorHandler");

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const ALLOWED = ["title", "description", "status", "priority", "dueDate"];
const pick = (obj) => Object.fromEntries(Object.entries(obj).filter(([k]) => ALLOWED.includes(k)));

const getTasks = async ({ search, status, priority }) => {
  const query = {};
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (search && search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), "i");
    query.$or = [{ title: rx }, { description: rx }];
  }
  return Task.find(query).sort({ createdAt: -1 });
};

const getTaskById = async (id) => {
  const task = await Task.findById(id);
  if (!task) throw new AppError("Task not found", 404);
  return task;
};

const createTask = (data) => Task.create(pick(data));

const updateTask = async (id, data) => {
  const task = await Task.findByIdAndUpdate(id, pick(data), { new: true, runValidators: true });
  if (!task) throw new AppError("Task not found", 404);
  return task;
};

const updateStatus = (id, status) => updateTask(id, { status });

const deleteTask = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  if (!task) throw new AppError("Task not found", 404);
  return task;
};

module.exports = { getTasks, getTaskById, createTask, updateTask, updateStatus, deleteTask };
