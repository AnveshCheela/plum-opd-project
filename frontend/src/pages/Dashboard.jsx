import { useEffect, useState } from "react";
import API from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    totalClaims: 0,
    approved: 0,
    rejected: 0,
    manualReview: 0,
    totalApprovedAmount: 0,
    totalClaimedAmount: 0,
    savings: 0,
    approvalRate: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get("/claims/stats");
      setStats(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Analytics Dashboard</h1>
        <p>Real-time claim adjudication metrics and insights</p>
      </div>

      <div className="container">
        <div className="stats-grid">
          <div className="stat-card stat-total">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <p className="stat-label">Total Claims</p>
              <h2 className="stat-value">{stats.totalClaims}</h2>
            </div>
          </div>

          <div className="stat-card stat-approved">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <p className="stat-label">Approved</p>
              <h2 className="stat-value">{stats.approved}</h2>
              <p className="stat-subtext">{stats.approvalRate}% approval rate</p>
            </div>
          </div>

          <div className="stat-card stat-rejected">
            <div className="stat-icon">❌</div>
            <div className="stat-content">
              <p className="stat-label">Rejected</p>
              <h2 className="stat-value">{stats.rejected}</h2>
            </div>
          </div>

          <div className="stat-card stat-review">
            <div className="stat-icon">👁️</div>
            <div className="stat-content">
              <p className="stat-label">Manual Review</p>
              <h2 className="stat-value">{stats.manualReview}</h2>
            </div>
          </div>
        </div>

        <div className="financial-metrics">
          <div className="metric-card metric-approved">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <p className="metric-label">Approved Amount</p>
              <h3 className="metric-value">₹{stats.totalApprovedAmount.toLocaleString()}</h3>
            </div>
          </div>

          <div className="metric-card metric-claimed">
            <div className="metric-icon">💵</div>
            <div className="metric-content">
              <p className="metric-label">Total Claimed</p>
              <h3 className="metric-value">₹{stats.totalClaimedAmount.toLocaleString()}</h3>
            </div>
          </div>

          <div className="metric-card metric-savings">
            <div className="metric-icon">🎯</div>
            <div className="metric-content">
              <p className="metric-label">Cost Savings</p>
              <h3 className="metric-value">₹{stats.savings.toLocaleString()}</h3>
              <p className="metric-subtext">Controlled payouts</p>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <div className="chart-card">
            <h3>Claim Distribution</h3>
            <div className="chart">
              <div className="chart-bar">
                <div className="bar-label">Approved</div>
                <div className="bar-container">
                  <div 
                    className="bar" 
                    style={{
                      width: `${(stats.approved / stats.totalClaims) * 100}%`,
                      background: 'linear-gradient(90deg, #10b981, #059669)'
                    }}
                  >
                    <span className="bar-text">{stats.approved}</span>
                  </div>
                </div>
              </div>
              <div className="chart-bar">
                <div className="bar-label">Rejected</div>
                <div className="bar-container">
                  <div 
                    className="bar" 
                    style={{
                      width: `${(stats.rejected / stats.totalClaims) * 100}%`,
                      background: 'linear-gradient(90deg, #ef4444, #dc2626)'
                    }}
                  >
                    <span className="bar-text">{stats.rejected}</span>
                  </div>
                </div>
              </div>
              <div className="chart-bar">
                <div className="bar-label">Manual Review</div>
                <div className="bar-container">
                  <div 
                    className="bar" 
                    style={{
                      width: `${(stats.manualReview / stats.totalClaims) * 100}%`,
                      background: 'linear-gradient(90deg, #f59e0b, #d97706)'
                    }}
                  >
                    <span className="bar-text">{stats.manualReview}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;