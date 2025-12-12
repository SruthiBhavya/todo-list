import React, { useState, useEffect } from "react";
import "./TodoApp.css";

export default function TodoApp() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (editingId) {
      setTasks(
        tasks.map((task) =>
          task.id === editingId ? { ...task, text: input } : task
        )
      );
      setEditingId(null);
    } else {
      setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
    }
    setInput("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const startEdit = (task) => {
    setInput(task.text);
    setEditingId(task.id);
  };

  const filteredTasks =
    filter === "completed"
      ? tasks.filter((t) => t.completed)
      : filter === "active"
      ? tasks.filter((t) => !t.completed)
      : tasks;

  return (
    <div className="todo-container">
      <h2 className="title">To-Do List</h2>

      <form onSubmit={handleSubmit} className="todo-form">
        <input
          className="todo-input"
          type="text"
          placeholder="Enter task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn add-btn" type="submit">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <div className="filter-box" role="tablist" aria-label="Filters">
        <button
          className={filter === "all" ? "filter-btn active" : "filter-btn"}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "active" ? "filter-btn active" : "filter-btn"}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={filter === "completed" ? "filter-btn active" : "filter-btn"}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <div className="tasks-area">
        {filteredTasks.length === 0 ? (
          <p className="no-task">No Tasks</p>
        ) : (
          filteredTasks.map((task) => (
            <div className="task-item" key={task.id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
                aria-label={`Mark ${task.text} complete`}
              />

              <span className={task.completed ? "task-text completed" : "task-text"}>
                {task.text}
              </span>

              <button className="btn edit-btn" onClick={() => startEdit(task)}>
                Edit
              </button>
              <button className="btn delete-btn" onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}