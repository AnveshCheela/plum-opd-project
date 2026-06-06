import { useEffect, useState } from "react";
import API from "../services/api";
import "./ReviewClaims.css";

function ReviewClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Track which claim is being adjudicated inline: { id: string, type: 'approve' | 'reject' }
  const [actionState, setActionState] = useState(null);
  
  // Form fields for inline adjudication
  const [approvedAmount, setApprovedAmount] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [submittingId, setSubmittingId] = useState("");

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("/claims");
      // Filter only manual review claims
      const pendingClaims = response.data.filter(c => c.decision === "MANUAL_REVIEW");
      setClaims(pendingClaims);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch claims for review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartApprove = (claim) => {
    const defaultAmount = claim.claimAmountRequested || claim.claimAmount || 0;
    setActionState({ id: claim._id, type: "approve" });
    setApprovedAmount(defaultAmount.toString());
    setRejectionReason("");
  };

  const handleStartReject = (claim) => {
    setActionState({ id: claim._id, type: "reject" });
    setRejectionReason("Requested medical services do not meet policy terms.");
    setApprovedAmount("");
  };

  const handleStartRequestInfo = (claim) => {
    setActionState({ id: claim._id, type: "info" });
    setRejectionReason("Please provide a clearer prescription or itemized bill.");
    setApprovedAmount("");
  };

  const handleCancelAction = () => {
    setActionState(null);
    setApprovedAmount("");
    setRejectionReason("");
  };

  const handleConfirmDecision = async (claimId) => {
    if (!actionState) return;
    
    setSubmittingId(claimId);
    setError("");

    try {
      const decisionData = {};

      if (actionState.type === "approve") {
        decisionData.decision = "APPROVED";
        decisionData.approvedAmount = Number(approvedAmount) || 0;
      } else if (actionState.type === "reject") {
        decisionData.decision = "REJECTED";
        decisionData.rejectionReasons = [rejectionReason || "Manually rejected by administrator"];
      } else if (actionState.type === "info") {
        decisionData.decision = "INFO_REQUIRED";
        decisionData.rejectionReasons = [rejectionReason || "Additional information requested by administrator"];
      }

      await API.put(`/claims/${claimId}/adjudicate`, decisionData);
      
      // Clear action state and reload pending claims
      setActionState(null);
      await fetchClaims();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update claim decision.");
    } finally {
      setSubmittingId("");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading pending reviews...</p>
      </div>
    );
  }

  return (
    <div className="review-claims-page">
      <div className="review-header">
        <h1>👁️ Manual Claim Review</h1>
        <p>Inspect and adjudicate claims marked for administrator attention</p>
      </div>

      <div className="container">
        {error && <div className="error-banner">{error}</div>}

        {claims.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎉</div>
            <h3>No Pending Reviews</h3>
            <p>Excellent! All claims have been processed and resolved.</p>
          </div>
        ) : (
          <div className="claims-list">
            {claims.map((claim) => {
              const isCurrentAction = actionState && actionState.id === claim._id;
              const isCurrentSubmitting = submittingId === claim._id;

              return (
                <div key={claim._id} className="review-card">
                  <div className="review-card-header">
                    <div>
                      <h3 className="patient-name">{claim.patientName}</h3>
                      <span className="member-id">ID: {claim.memberId} ({claim.memberName})</span>
                    </div>
                    <span className="badge badge-info">PENDING REVIEW</span>
                  </div>

                  <div className="review-card-body">
                    <div className="review-grid">
                      <div className="review-item">
                        <label>👨‍⚕️ Doctor</label>
                        <p>{claim.doctorName || "N/A"}</p>
                      </div>
                      <div className="review-item">
                        <label>🏥 Hospital</label>
                        <p>{claim.hospitalName || "N/A"}</p>
                      </div>
                      <div className="review-item">
                        <label>🔍 Diagnosis</label>
                        <p>{claim.diagnosis || "N/A"}</p>
                      </div>
                      <div className="review-item">
                        <label>📅 Treatment Date</label>
                        <p>{claim.treatmentDate || "N/A"}</p>
                      </div>
                      <div className="review-item">
                        <label>Requested Amount</label>
                        <p className="bold-amount">₹{(claim.claimAmountRequested || claim.claimAmount || 0).toLocaleString()}</p>
                      </div>
                      <div className="review-item">
                        <label>Confidence Score</label>
                        <p>{claim.confidenceScore ? `${Math.round(claim.confidenceScore * 100)}%` : "N/A"}</p>
                      </div>
                    </div>

                    {claim.rejectionReasons && claim.rejectionReasons.length > 0 && (
                      <div className="fraud-warning">
                        <label>AI Adjudication Flags:</label>
                        <ul>
                          {claim.rejectionReasons.map((reason, idx) => (
                            <li key={idx}>⚠️ {reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action buttons (only show if not currently performing action on this card) */}
                    {!isCurrentAction && (
                      <div className="review-actions">
                        <button 
                          className="btn btn-primary"
                          onClick={() => handleStartApprove(claim)}
                        >
                          Approve Claim
                        </button>
                        <button 
                          className="btn btn-secondary reject-btn"
                          onClick={() => handleStartReject(claim)}
                        >
                          Reject Claim
                        </button>
                        <button 
                          className="btn btn-secondary info-btn"
                          onClick={() => handleStartRequestInfo(claim)}
                        >
                          Request Info
                        </button>
                      </div>
                    )}

                    {/* Inline decision form */}
                    {isCurrentAction && (
                      <div className="inline-action-panel">
                        <div className="divider"></div>
                        
                        {actionState.type === "approve" ? (
                          <div className="form-group">
                            <label htmlFor={`amount-${claim._id}`}>Enter Approved Amount (₹)</label>
                            <input
                              id={`amount-${claim._id}`}
                              type="number"
                              value={approvedAmount}
                              onChange={(e) => setApprovedAmount(e.target.value)}
                              disabled={isCurrentSubmitting}
                              placeholder="Approved amount"
                            />
                          </div>
                        ) : actionState.type === "reject" ? (
                          <div className="form-group">
                            <label htmlFor={`reason-${claim._id}`}>Rejection Reasons / Notes</label>
                            <textarea
                              id={`reason-${claim._id}`}
                              rows="3"
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              disabled={isCurrentSubmitting}
                              placeholder="Reason for rejection..."
                            />
                          </div>
                        ) : (
                          <div className="form-group">
                            <label htmlFor={`reason-${claim._id}`}>Requested Information / Comments</label>
                            <textarea
                              id={`reason-${claim._id}`}
                              rows="3"
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              disabled={isCurrentSubmitting}
                              placeholder="Describe what documents or details are needed..."
                            />
                          </div>
                        )}

                        <div className="panel-actions">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleConfirmDecision(claim._id)}
                            disabled={isCurrentSubmitting}
                          >
                            {isCurrentSubmitting ? "Submitting..." : "Confirm Decision"}
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={handleCancelAction}
                            disabled={isCurrentSubmitting}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewClaims;
