import { useState } from "react";

export default function TaskForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    description: initial?.description || "",
    priority: initial?.priority || "medium",
    dueDate: initial?.dueDate ? initial.dueDate.slice(0, 10) : "",
  });
  const [saving, setSaving] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await onSubmit({ ...form, dueDate: form.dueDate || null });
      if (!initial) setForm({ title: "", description: "", priority: "medium", dueDate: "" });
    } catch {
      /* error is shown by the parent */
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <input name="title" placeholder="Task title *" value={form.title} onChange={change} maxLength={100} required />
      <textarea name="description" placeholder="Description" value={form.description} onChange={change} maxLength={500} />
      <div className="row">
        <select name="priority" value={form.priority} onChange={change}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input type="date" name="dueDate" value={form.dueDate} onChange={change} />
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : initial ? "Update" : "Add task"}
        </button>
        {initial && (
          <button type="button" className="ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
