import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 5 };
      if (status) params.status = status;
      if (priority) params.priority = priority;
      if (search) params.search = search;
      if (sort) params.sort = sort;
      const res = await api.get('/tasks', { params });
      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [status, priority, search, sort, page]);

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/tasks/${taskId}`);
    fetchTasks();
  };

  const handleComplete = async (taskId) => {
    await api.patch(`/tasks/${taskId}/complete`);
    fetchTasks();
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="page">
      <div className="top-bar">
        <h2>My Tasks</h2>
        <div>
          <Link to="/analytics">Analytics</Link> | <button onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="filters">
        <input placeholder="Search by title" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select value={priority} onChange={(e) => { setPriority(e.target.value); setPage(1); }}>
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort: Newest</option>
          <option value="dueDate">Sort: Due Date</option>
          <option value="priority">Sort: Priority</option>
        </select>
        <Link to="/tasks/new"><button>+ New Task</button></Link>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && tasks.length === 0 && <p>No tasks found.</p>}

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className={`task-item priority-${task.priority}`}>
            <div>
              <strong>{task.title}</strong> — {task.status} — {task.priority}
              {task.dueDate && <span> — due {task.dueDate.slice(0, 10)}</span>}
              <p>{task.description}</p>
            </div>
            <div className="task-actions">
              {task.status !== 'done' && <button onClick={() => handleComplete(task._id)}>Complete</button>}
              <Link to={`/tasks/edit/${task._id}`}><button>Edit</button></Link>
              <button onClick={() => handleDelete(task._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span> Page {page} of {totalPages || 1} </span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}