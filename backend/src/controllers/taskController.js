const service = require("../services/taskService");
const asyncHandler = require("../middleware/asyncHandler");

exports.getTasks = asyncHandler(async (req, res) => {
  const tasks = await service.getTasks(req.query);
  res.json({ success: true, count: tasks.length, data: tasks });
});

exports.getTask = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.getTaskById(req.params.id) });
});

exports.createTask = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await service.createTask(req.body) });
});

exports.updateTask = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.updateTask(req.params.id, req.body) });
});

exports.updateStatus = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await service.updateStatus(req.params.id, req.body.status) });
});

exports.deleteTask = asyncHandler(async (req, res) => {
  await service.deleteTask(req.params.id);
  res.json({ success: true, message: "Task deleted" });
});
