import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export const getErrorMessage = (err) =>
  err.response?.data?.message || (err.request ? "Cannot reach server. Try again." : err.message);

export const fetchTasks = (params) => api.get("/tasks", { params }).then((r) => r.data.data);
export const createTask = (data) => api.post("/tasks", data).then((r) => r.data.data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data).then((r) => r.data.data);
export const updateStatus = (id, status) =>
  api.patch(`/tasks/${id}/status`, { status }).then((r) => r.data.data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
