import { useEffect, useState } from 'react';

const API_URL = '/api';

export default function App() {
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage('Unable to load tasks right now.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: taskText })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add task');

      setTaskText('');
      setMessage('Task added successfully.');
      await fetchTasks();
    } catch (error) {
      setMessage(error.message || 'Failed to add task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="card">
        <h1>Task Manager</h1>
        <p>Add a task and see it appear from the backend database.</p>

        <form onSubmit={handleAddTask} className="task-form">
          <input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Enter a task"
            aria-label="Task input"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </form>

        {message ? <p className="message">{message}</p> : null}

        <h2>Saved Tasks</h2>
        <ul className="task-list">
          {tasks.length === 0 ? (
            <li className="empty-state">No tasks yet. Add one above.</li>
          ) : (
            tasks.map((task) => <li key={task._id}>{task.text}</li>)
          )}
        </ul>
      </section>
    </main>
  );
}
