import { useLocation, useNavigate } from "react-router-dom";
import "./Result.css";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) {
    return (
      <div className="result-container no-result">
        <div className="no-result-content">
          <div className="no-result-icon">🔍</div>
          <h2>No Result Found</h2>
          <p>Please submit a claim first to see the adjudication result</p>
          <button className="btn btn-primary" onClick={() => navigate("/upload")}>
            Submit Claim
          </button>
        </div>
      </div>
    );
  }

  const { extractedData, decision } = data;

  const getDecisionColor = () => {
    if (decision.decision === "APPROVED") return "success";
    if (decision.decision === "REJECTED") return "danger";
    if (decision.decision === "PARTIAL") return "warning";
    return "info";
  };

  const getDecisionIcon = () => {
    if (decision.decision === "APPROVED") return "✅";
    if (decision.decision === "REJECTED") return "❌";
    if (decision.decision === "PARTIAL") return "⚠️";
    return "👁️";
  };

  return (
    <div className="result-container">
      <div className="result-header">
        <h1>📊 Claim Adjudication Result</h1>
        <p>Your claim has been analyzed and a decision has been generated</p>
      </div>

      <div className="result-content">
        {/* Decision Card */}
        <div className={`decision-card decision-${getDecisionColor()}`}>
          <div className="decision-icon">{getDecisionIcon()}</div>
          <div className="decision-content">
            <p className="decision-label">Adjudication Decision</p>
            <h2 className="decision-text">{decision.decision}</h2>
            <p className="decision-subtext">
              Confidence Score: {Math.round(decision.confidenceScore * 100)}%
            </p>
          </div>
        </div>

        {/* Patient Information */}
        <div className="result-card">
          <div className="card-header">
            <h3>👤 Patient Information</h3>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <label>Patient Name</label>
                <p>{extractedData.patientName}</p>
              </div>
              <div className="info-item">
                <label>Doctor</label>
                <p>{extractedData.doctorName}</p>
              </div>
              <div className="info-item">
                <label>Doctor Registration</label>
                <p>{extractedData.doctorRegistration || "N/A"}</p>
              </div>
              <div className="info-item">
                <label>Diagnosis</label>
                <p>{extractedData.diagnosis}</p>
              </div>
              <div className="info-item">
                <label>Treatment Date</label>
                <p>{extractedData.treatmentDate}</p>
              </div>
              <div className="info-item">
                <label>Document Type</label>
                <p>{extractedData.documentType}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Medicines */}
        {extractedData.medicines && extractedData.medicines.length > 0 && (
          <div className="result-card">
            <div className="card-header">
              <h3>💊 Medicines Prescribed</h3>
            </div>
            <div className="card-content">
              <div className="medicines-list">
                {extractedData.medicines.map((medicine, index) => (
                  <div key={index} className="medicine-item">
                    <span className="medicine-icon">💉</span>
                    <div className="medicine-details">
                      <p className="medicine-name">{medicine.name}</p>
                      <p className="medicine-info">
                        {medicine.dosage} • {medicine.duration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tests */}
        {extractedData.testsPrescribed && extractedData.testsPrescribed.length > 0 && (
          <div className="result-card">
            <div className="card-header">
              <h3>🔬 Tests Prescribed</h3>
            </div>
            <div className="card-content">
              <div className="tests-list">
                {extractedData.testsPrescribed.map((test, index) => (
                  <div key={index} className="test-item">
                    <span className="test-icon">🧪</span>
                    <p>{test}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Claim Amount */}
        <div className="result-card">
          <div className="card-header">
            <h3>💰 Financial Details</h3>
          </div>
          <div className="card-content">
            <div className="amounts-grid">
              <div className="amount-card">
                <label>Requested Amount</label>
                <p className="amount">₹{extractedData.claimAmount || 0}</p>
              </div>
              <div className="amount-card approved">
                <label>Approved Amount</label>
                <p className="amount">₹{decision.approvedAmount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rejection Reasons */}
        {decision.rejectionReasons && decision.rejectionReasons.length > 0 && (
          <div className="result-card rejection-card">
            <div className="card-header">
              <h3>⚠️ Rejection Reasons</h3>
            </div>
            <div className="card-content">
              <ul className="reasons-list">
                {decision.rejectionReasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="result-actions">
          <button className="btn btn-secondary" onClick={() => navigate("/upload")}>
            <span>➕</span> Submit Another Claim
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/history")}>
            <span>📋</span> View All Claims
          </button>
        </div>
      </div>
    </div>
  );
}

export default Result;