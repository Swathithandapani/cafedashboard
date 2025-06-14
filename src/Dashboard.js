import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  TimeScale
);

const Dashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [suggestion, setSuggestion] = useState('');

  const fetchData = async () => {
    const snapshot = await getDocs(collection(db, 'feedbacks'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setFeedbacks(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteFeedback = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      await deleteDoc(doc(db, 'feedbacks', id));
      fetchData();
    }
  };

  const getFilteredData = () => {
    const now = new Date();
    if (filter === 'all') return feedbacks;

    return feedbacks.filter(item => {
      const ts = item.timestamp?.toDate?.() || new Date(item.timestamp);
      if (filter === 'day') return ts.toDateString() === now.toDateString();
      if (filter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return ts >= weekAgo;
      }
      if (filter === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        return ts >= monthAgo;
      }
      return true;
    });
  };

  const calculateAverages = (data) => {
    const categories = ['food', 'cleanliness', 'music', 'service'];
    const scores = { food: 0, cleanliness: 0, music: 0, service: 0 };
    data.forEach(f => {
      categories.forEach(cat => {
        const emoji = f[cat];
        const score = emoji === '😍' ? 4 : emoji === '🙂' ? 3 : emoji === '😐' ? 2 : emoji === '😡' ? 1 : 0;
        scores[cat] += score;
      });
    });

    const averages = {};
    categories.forEach(cat => {
      averages[cat] = data.length ? parseFloat((scores[cat] / data.length).toFixed(2)) : 0;
    });

    return averages;
  };

  const calculateEngagement = () => {
    const map = {};
    feedbacks.forEach(f => {
      const date = new Date(f.timestamp?.seconds * 1000).toLocaleDateString();
      map[date] = (map[date] || 0) + 1;
    });
    return map;
  };

  const getMostRegularUser = () => {
    const userCount = {};
    feedbacks.forEach(f => {
      const name = f.name || 'Anonymous';
      userCount[name] = (userCount[name] || 0) + 1;
    });
    const sorted = Object.entries(userCount).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : 'N/A';
  };

  const dailyData = getFilteredData();
  const allData = feedbacks;
  const dailyAverages = calculateAverages(dailyData);
  const overallAverages = calculateAverages(allData);

  const categories = ['Food', 'Cleanliness', 'Music', 'Service'];
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

  const pieData = {
    labels: categories,
    datasets: [
      {
        data: categories.map(cat => dailyAverages[cat.toLowerCase()] || 0),
        backgroundColor: colors,
      },
    ],
  };

  const barData = {
    labels: categories,
    datasets: [
      {
        label: 'Average Rating (Overall)',
        data: categories.map(cat => overallAverages[cat.toLowerCase()] || 0),
        backgroundColor: colors,
      },
    ],
  };

  const engagementMap = calculateEngagement();
  const lineData = {
    labels: Object.keys(engagementMap),
    datasets: [
      {
        label: 'User Engagement Per Day',
        data: Object.values(engagementMap),
        fill: false,
        borderColor: '#f0ad4e',
        tension: 0.1,
      },
    ],
  };

  const generateSuggestion = () => {
    const lowest = Object.entries(overallAverages).sort((a, b) => a[1] - b[1])[0];
    if (lowest && lowest[1] < 3) {
      return `${lowest[0][0].toUpperCase() + lowest[0].slice(1)} should be improved.`;
    }
    return 'Overall feedback is good.';
  };

  useEffect(() => {
    setSuggestion(generateSuggestion());
  }, [feedbacks]);

  const today = new Date().toDateString();
  const newFeedbacks = feedbacks.filter(f => new Date(f.timestamp?.seconds * 1000).toDateString() === today);
  const oldFeedbacks = feedbacks.filter(f => new Date(f.timestamp?.seconds * 1000).toDateString() !== today);

  const exportToCSV = () => {
    const headers = ['Name', 'Timestamp', 'Food', 'Cleanliness', 'Music', 'Service', 'Feedback'];
    const rows = feedbacks.map(f => [
      f.name || 'Anonymous',
      new Date(f.timestamp?.seconds * 1000).toLocaleString(),
      f.food,
      f.cleanliness,
      f.music,
      f.service,
      `"${(f.feedback || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smartcafe_feedbacks.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const mostRegularUser = getMostRegularUser();

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <style>{`
          .dashboard-wrapper {
            display: flex;
            justify-content: center;
          }
          .dashboard-container {

            min-height: 100vh;
            width: 100vw;
            padding: 20px;
            color: white;
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.65)),
                        url("https://www.pixelstalk.net/wp-content/uploads/images1/Cafe-Wallpapers-HD-Free-download.jpg");
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            position: relative;
          }
          .most-engaged-user-badge {
            position: absolute;
            top: 20px;
            right: 80px;
            background:#28a745;
            color: black;
            font-size:20px;
            padding: 10px 20px;
            border-radius: 10px;
            font-weight: bold;
            box-shadow: 0 0 10px rgba(0,0,0,0.4);
          }
          .heading {
            text-align: center;
            margin-bottom: 10px;
          }
          .subheading {
            text-align: center;
            color: #f0ad4e;
            margin-bottom: 20px;
          }
          .chart-section {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
          }
          .chart-box {
            flex: 1 1 300px;
            max-width: 450px;
            background: #222;
            padding: 15px;
            border-radius: 10px;
          }
          .filter-buttons {
            text-align: center;
            margin-bottom: 20px;
          }
          .filter-buttons button {
            margin: 5px;
            padding: 10px 20px;
            background-color: #444;
            border: 1px solid #555;
            border-radius: 5px;
            color: white;
            cursor: pointer;
          }
          .filter-buttons button.active {
            background-color: #f57c00;
          }
          .feedback-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            max-width: 95%;
            margin: 30px auto;
          }
          .feedback-box {
            flex: 1 1 400px;
            background: #222;
            border-radius: 10px;
            padding: 20px;
            min-height: 200px;
          }
          .feedback-entry {
            border-bottom: 1px solid #444;
            padding: 10px 0;
            position: relative;
          }
          .delete-button {
            position: absolute;
            top: 10px;
            right: 0;
            color: red;
            font-size: 18px;
            cursor: pointer;
            background: transparent;
            border: none;
          }
          .export-button {
            display: block;
            margin: 30px auto 0;
            padding: 10px 25px;
            font-size: 16px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          .chart-box h4, .feedback-box h3 {
            text-align: center;
          }

          /* === Responsive Enhancements === */
          @media screen and (max-width: 768px) {
            .dashboard-container {
              padding: 10px;
            }

            .most-engaged-user-badge {
              position: static;
              margin: 10px auto;
              text-align: center;
            }

            .chart-section {
              flex-direction: column;
              align-items: center;
            }

            .chart-box {
              max-width: 100%;
              width: 100%;
            }

            .feedback-container {
              flex-direction: column;
              align-items: center;
            }

            .feedback-box {
              width: 100%;
            }

            .filter-buttons button {
              padding: 8px 14px;
              font-size: 14px;
            }

            .export-button {
              width: 90%;
              padding: 12px;
              font-size: 16px;
            }
          }
        `}</style>

        <div className="most-engaged-user-badge">
          🌟 Most Engaged User: {mostRegularUser}
        </div>

        <h1 className="heading">☕ Smart Café Admin Dashboard</h1>
        <h3 className="subheading">{suggestion}</h3>

        <div className="filter-buttons">
          {['all', 'day', 'week', 'month'].map(f => (
            <button
              key={f}
              className={filter === f ? 'active' : ''}
          onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="chart-section">
          <div className="chart-box">
            <h4>📈 User Engagement</h4>
            <Line data={lineData} />
          </div>
          <div className="chart-box">
            <h4>📅 Daily Ratings (Pie Chart)</h4>
            <Pie data={pieData} />
          </div>
          <div className="chart-box">
            <h4>📊 Overall Ratings (Bar Chart)</h4>
            <Bar data={barData} />
          </div>
        </div>

        <div className="feedback-container">
          <div className="feedback-box">
            <h3>🆕 New Feedbacks</h3>
            {newFeedbacks.length === 0 && <p>No new feedbacks today.</p>}
            {newFeedbacks.map((f, index) => (
              <div key={index} className="feedback-entry">
                <button className="delete-button" onClick={() => handleDeleteFeedback(f.id)}>🗑️</button>
                <p><strong>{f.name || 'Anonymous'}</strong> — <em>{new Date(f.timestamp?.seconds * 1000).toLocaleString()}</em></p>
                <p>🍽️ Food: {f.food} | 🧹 Cleanliness: {f.cleanliness} | 🎵 Music: {f.music} | 🧑‍🍳 Service: {f.service}</p>
                <p>💬 {f.feedback}</p>
              </div>
            ))}
          </div>
          <div className="feedback-box">
            <h3>🗂️ Older Feedbacks</h3>
            {oldFeedbacks.length === 0 && <p>No older feedbacks found.</p>}
            {oldFeedbacks.map((f, index) => (
              <div key={index} className="feedback-entry">
                <button className="delete-button" onClick={() => handleDeleteFeedback(f.id)}>🗑️</button>
                <p><strong>{f.name || 'Anonymous'}</strong> — <em>{new Date(f.timestamp?.seconds * 1000).toLocaleString()}</em></p>
                <p>🍽️ Food: {f.food} | 🧹 Cleanliness: {f.cleanliness} | 🎵 Music: {f.music} | 🧑‍🍳 Service: {f.service}</p>
                <p>💬 {f.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        <button className="export-button" onClick={exportToCSV}>
          📥 Export Feedback as CSV
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
