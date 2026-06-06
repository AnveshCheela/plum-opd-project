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
    aiAccuracy: {
      ocrAccuracy: 92,
      doctorNameAccuracy: 95,
      diagnosisAccuracy: 89,
      overallAccuracy: 93
    }
  });

  const [config, setConfig] = useState({
    perClaimLimit: 5000,
    waitingPeriodDiabetes: 90,
    waitingPeriodHypertension: 90,
    waitingPeriodJointReplacement: 730,
    networkDiscountPercentage: 20,
    copayPercentage: 10
  });

  const [loading, setLoading] = useState(true);
  const [configSuccess, setConfigSuccess] = useState("");
  const [configError, setConfigError] = useState("");

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchConfig()]);
      setLoading(false);
    };
    initData();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get("/claims/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Stats fetch error:", error);
    }
  };

  const fetchConfig = async () => {
    try {
      const response = await API.get("/claims/config");
      if (response.data.success) {
        setConfig(response.data.config);
      }
    } catch (error) {
      console.error("Config fetch error:", error);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setConfigSuccess("");
    setConfigError("");
    try {
      const response = await API.put("/claims/config", config);
      if (response.data.success) {
        setConfigSuccess("Policy configurations saved successfully!");
        setConfig(response.data.config);
        setTimeout(() => setConfigSuccess(""), 4000);
      }
    } catch (error) {
      console.error(error);
      setConfigError(error.response?.data?.message || "Failed to save configurations.");
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
                    className="bar bar-approved" 
                    style={{
                      width: `${(stats.approved / stats.totalClaims) * 100}%`
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
                    className="bar bar-rejected" 
                    style={{
                      width: `${(stats.rejected / stats.totalClaims) * 100}%`
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
                    className="bar bar-review" 
                    style={{
                      width: `${(stats.manualReview / stats.totalClaims) * 100}%`
                    }}
                  >
                    <span className="bar-text">{stats.manualReview}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* AI Accuracy Card */}
          <div className="chart-card ai-metrics-card">
            <h3>🤖 AI Extraction & OCR Performance</h3>
            <p className="section-desc">Evaluations of system accuracy for automatically parsed documents.</p>
            <div className="metrics-list">
              <div className="metric-progress-item">
                <div className="metric-progress-header">
                  <span className="metric-name">OCR Text Extraction Accuracy</span>
                  <span className="metric-percentage">{stats.aiAccuracy?.ocrAccuracy || 92}%</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${stats.aiAccuracy?.ocrAccuracy || 92}%` }}></div>
                </div>
              </div>

              <div className="metric-progress-item">
                <div className="metric-progress-header">
                  <span className="metric-name">Doctor Name Matching Accuracy</span>
                  <span className="metric-percentage">{stats.aiAccuracy?.doctorNameAccuracy || 95}%</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${stats.aiAccuracy?.doctorNameAccuracy || 95}%` }}></div>
                </div>
              </div>

              <div className="metric-progress-item">
                <div className="metric-progress-header">
                  <span className="metric-name">Diagnosis Identification Accuracy</span>
                  <span className="metric-percentage">{stats.aiAccuracy?.diagnosisAccuracy || 89}%</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${stats.aiAccuracy?.diagnosisAccuracy || 89}%` }}></div>
                </div>
              </div>

              <div className="metric-progress-item overall-accuracy-item">
                <div className="metric-progress-header">
                  <span className="metric-name font-bold">Overall Extraction Accuracy</span>
                  <span className="metric-percentage font-bold">{stats.aiAccuracy?.overallAccuracy || 93}%</span>
                </div>
                <div className="progress-bar-container overall-bar">
                  <div className="progress-bar-fill" style={{ width: `${stats.aiAccuracy?.overallAccuracy || 93}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Policy Configurations Form Card */}
          <div className="chart-card policy-config-card">
            <h3>⚙️ Policy Configurations (MongoDB)</h3>
            <p className="section-desc">Fine-tune rule engine criteria for automated adjudication.</p>
            
            {configSuccess && <div className="alert alert-success">{configSuccess}</div>}
            {configError && <div className="alert alert-danger">{configError}</div>}

            <form onSubmit={handleSaveConfig} className="config-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="perClaimLimit">Per Claim Limit (₹)</label>
                  <input
                    id="perClaimLimit"
                    type="number"
                    value={config.perClaimLimit}
                    onChange={(e) => setConfig({ ...config, perClaimLimit: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="copayPercentage">Co-payment (%)</label>
                  <input
                    id="copayPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={config.copayPercentage}
                    onChange={(e) => setConfig({ ...config, copayPercentage: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="networkDiscountPercentage">Network Discount (%)</label>
                  <input
                    id="networkDiscountPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={config.networkDiscountPercentage}
                    onChange={(e) => setConfig({ ...config, networkDiscountPercentage: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="waitingPeriodDiabetes">Diabetes Wait (Days)</label>
                  <input
                    id="waitingPeriodDiabetes"
                    type="number"
                    value={config.waitingPeriodDiabetes}
                    onChange={(e) => setConfig({ ...config, waitingPeriodDiabetes: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="waitingPeriodHypertension">Hypertension Wait (Days)</label>
                  <input
                    id="waitingPeriodHypertension"
                    type="number"
                    value={config.waitingPeriodHypertension}
                    onChange={(e) => setConfig({ ...config, waitingPeriodHypertension: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="waitingPeriodJointReplacement">Joint Replace Wait (Days)</label>
                  <input
                    id="waitingPeriodJointReplacement"
                    type="number"
                    value={config.waitingPeriodJointReplacement}
                    onChange={(e) => setConfig({ ...config, waitingPeriodJointReplacement: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary config-save-btn">
                Save Configurations
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;