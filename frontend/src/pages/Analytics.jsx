import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tasks/analytics').then((res) => setData(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="page">Loading...</p>;
  if (!data) return <p className="page">Failed to load analytics.</p>;

  const chartData = [
    { name: 'Completed', value: data.completed },
    { name: 'Pending', value: data.pending },
  ];
  const COLORS = ['#4caf50', '#ff9800'];

  return (
    <div className="page">
      <div className="top-bar">
        <h2>Analytics</h2>
        <Link to="/tasks">Back to Tasks</Link>
      </div>
      <div className="stats-cards">
        <div className="stat-card"><h3>{data.total}</h3><p>Total Tasks</p></div>
        <div className="stat-card"><h3>{data.completed}</h3><p>Completed</p></div>
        <div className="stat-card"><h3>{data.pending}</h3><p>Pending</p></div>
        <div className="stat-card"><h3>{data.completionPercentage}%</h3><p>Completion Rate</p></div>
      </div>
      {data.total > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={100} label>
              {chartData.map((entry, index) => <Cell key={index} fill={COLORS[index]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}