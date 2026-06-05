import { useEffect, useState } from "react";
import API from "../services/api";
import ClaimCard from "../components/ClaimCard";
import "./ClaimHistory.css";

function ClaimHistory() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const response = await API.get("/claims");
      setClaims(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredClaims = () => {
    if (filter === "all") return claims;
    return claims.filter(claim => claim.decision === filter);
  };

  const filteredClaims = getFilteredClaims();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Claims...</p>
      </div>
    );
  }

  return (
    <div className="claim-history">
      <div className="history-header">
        <h1>📋 Claim History</h1>
        <p>View all submitted and processed claims</p>
      </div>

      <div className="container">
        <div className="filter-section">
          <h3>Filter by Status</h3>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Claims ({claims.length})
            </button>
            <button 
              className={`filter-btn filter-approved ${filter === "APPROVED" ? "active" : ""}`}
              onClick={() => setFilter("APPROVED")}
            >
              ✅ Approved ({claims.filter(c => c.decision === "APPROVED").length})
            </button>
            <button 
              className={`filter-btn filter-rejected ${filter === "REJECTED" ? "active" : ""}`}
              onClick={() => setFilter("REJECTED")}
            >
              ❌ Rejected ({claims.filter(c => c.decision === "REJECTED").length})
            </button>
            <button 
              className={`filter-btn filter-review ${filter === "MANUAL_REVIEW" ? "active" : ""}`}
              onClick={() => setFilter("MANUAL_REVIEW")}
            >
              👁️ Manual Review ({claims.filter(c => c.decision === "MANUAL_REVIEW").length})
            </button>
          </div>
        </div>

        {filteredClaims.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No Claims Found</h3>
            <p>No claims match your current filter</p>
          </div>
        ) : (
          <div className="claims-list">
            {filteredClaims.map((claim) => (
              <ClaimCard
                key={claim._id}
                claim={claim}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClaimHistory;