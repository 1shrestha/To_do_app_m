export default function TaskItem({ task, onStatus, onEdit, onDelete }) {
  const done = task.status === "completed";
  return (
    <li className={`task ${done ? "done" : ""}`}>
      <input type="checkbox" checked={done} onChange={() => onStatus(task._id, done ? "pending" : "completed")} />
      <div className="info">
        <strong>{task.title}</strong>
        {task.description && <p>{task.description}</p>}
        <small>
          <span className={`badge ${task.priority}`}>{task.priority}</span>{" "}
          <select value={task.status} onChange={(e) => onStatus(task._id, e.target.value)}>
            <option value="pending">Pending</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
          {task.dueDate && <> · Due {new Date(task.dueDate).toLocaleDateString()}</>}
        </small>
      </div>
      <div className="actions">
        <button className="ghost" onClick={() => onEdit(task)}>Edit</button>
        <button className="danger" onClick={() => onDelete(task._id)}>Delete</button>
      </div>
    </li>
  );
}
