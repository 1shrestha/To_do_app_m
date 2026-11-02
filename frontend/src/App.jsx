import { useCallback, useEffect, useState } from "react";
import * as api from "./api";
import TaskForm from "./components/TaskForm.jsx";
import TaskItem from "./components/TaskItem.jsx";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      setTasks(await api.fetchTasks(params));
    } catch (e) {
      setError(api.getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  // Debounced fetch: re-runs whenever search/filter change
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const run = async (action) => {
    setError("");
    try {
      await action();
      await load();
    } catch (e) {
      setError(api.getErrorMessage(e));
      throw e;
    }
  };

  const handleSave = async (data) => {
    await run(() => (editing ? api.updateTask(editing._id, data) : api.createTask(data)));
    setEditing(null);
  };
  const handleStatus = (id, status) => run(() => api.updateStatus(id, status)).catch(() => {});
  const handleDelete = (id) => {
    if (window.confirm("Delete this task?")) run(() => api.deleteTask(id)).catch(() => {});
  };

  return (
    <main className="container">
      <h1>📝 To-Do List</h1>

      <TaskForm
        key={editing?._id || "new"}
        initial={editing}
        onSubmit={handleSave}
        onCancel={() => setEditing(null)}
      />

      <div className="toolbar">
        <input
          type="search"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {error && <div className="alert">{error}</div>}
      {loading && <p className="muted">Loading...</p>}
      {!loading && !error && tasks.length === 0 && <p className="muted">No tasks found.</p>}

      <ul className="list">
        {tasks.map((t) => (
          <TaskItem key={t._id} task={t} onStatus={handleStatus} onEdit={setEditing} onDelete={handleDelete} />
        ))}
      </ul>
    </main>
  );
}
