import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

export default function TaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      api.get('/tasks').then((res) => {
        const task = res.data.tasks.find((t) => t._id === id);
        if (task) {
          setTitle(task.title);
          setDescription(task.description || '');
          setStatus(task.status);
          setPriority(task.priority);
          setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : '');
        }
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { title, description, status, priority, dueDate: dueDate || null };
      if (isEdit) await api.put(`/tasks/${id}`, payload);
      else await api.post('/tasks', payload);
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="page">
      <h2>{isEdit ? 'Edit Task' : 'New Task'}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="task-form">
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button type="submit">{isEdit ? 'Update Task' : 'Create Task'}</button>
      </form>
    </div>
  );
}