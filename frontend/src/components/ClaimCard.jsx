import "./ClaimCard.css";

function ClaimCard({ claim }) {
  const getStatusColor = () => {
    if (claim.decision === "APPROVED") return "success";
    if (claim.decision === "REJECTED") return "danger";
    if (claim.decision === "PARTIAL") return "warning";
    if (claim.decision === "INFO_REQUIRED") return "info";
    return "info";
  };

  const getStatusIcon = () => {
    if (claim.decision === "APPROVED") return "✅";
    if (claim.decision === "REJECTED") return "❌";
    if (claim.decision === "PARTIAL") return "⚠️";
    if (claim.decision === "INFO_REQUIRED") return "📝";
    return "👁️";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className={`claim-card claim-${getStatusColor()}`}>
      <div className="claim-header">
        <div className="claim-title-section">
          <h3 className="claim-title">{claim.patientName}</h3>
          <p className="claim-date">
            {new Date(claim.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
        </div>
        <div className={`claim-status badge-${getStatusColor()}`}>
          <span className="status-icon">{getStatusIcon()}</span>
          <span className="status-text">
            {claim.decision === "INFO_REQUIRED" ? "INFO REQUIRED" : claim.decision}
          </span>
        </div>
      </div>

      <div className="claim-body">
        <div className="claim-grid">
          <div className="claim-item">
            <label>👨‍⚕️ Doctor</label>
            <p>{claim.doctorName}</p>
          </div>
          <div className="claim-item">
            <label>🏥 Hospital</label>
            <p>{claim.hospitalName || "N/A"}</p>
          </div>
          <div className="claim-item">
            <label>🔍 Diagnosis</label>
            <p>{claim.diagnosis}</p>
          </div>
          <div className="claim-item">
            <label>📅 Treatment Date</label>
            <p>{claim.treatmentDate || "N/A"}</p>
          </div>
        </div>

        <div className="claim-amounts">
          <div className="amount-box">
            <label>Claimed Amount</label>
            <p className="amount">{formatCurrency(claim.claimAmountRequested || claim.claimAmount || 0)}</p>
          </div>
          <div className="amount-box approved">
            <label>Approved Amount</label>
            <p className="amount">{formatCurrency(claim.approvedAmount || 0)}</p>
          </div>
        </div>

        {claim.rejectionReasons && claim.rejectionReasons.length > 0 && (
          <div className="rejection-reasons">
            <label>{claim.decision === "INFO_REQUIRED" ? "Information Requested:" : "Rejection Reasons:"}</label>
            <ul>
              {claim.rejectionReasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        {claim.confidenceScore && (
          <div className="confidence-score">
            <label>Confidence Score</label>
            <div className="score-bar">
              <div 
                className="score-fill"
                style={{ width: `${claim.confidenceScore * 100}%` }}
              >
                <span>{(claim.confidenceScore * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClaimCard;