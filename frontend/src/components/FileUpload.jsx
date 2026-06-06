import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./FileUpload.css";

function FileUpload() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formDataState, setFormDataState] = useState({
    memberId: "",
    memberName: "",
    treatmentDate: "",
    claimAmount: "",
    hospitalName: "",
    joinDate: "",
    cashlessRequest: false,
    networkHospital: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormDataState({
      ...formDataState,
      [name]: type === "checkbox" ? checked : value,
    });
    setError("");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const validateForm = () => {
    if (!formDataState.memberId.trim()) {
      return "Member ID is required.";
    }
    if (!formDataState.memberName.trim()) {
      return "Patient Name is required.";
    }
    if (!formDataState.claimAmount) {
      return "Claim Amount is required.";
    }
    const amount = Number(formDataState.claimAmount);
    if (isNaN(amount) || amount <= 0) {
      return "Claim Amount must be a positive number.";
    }
    if (amount < 500) {
      return "Claim Amount must be at least ₹500 (per policy terms minimum limit).";
    }
    if (!formDataState.treatmentDate) {
      return "Treatment Date is required.";
    }
    if (formDataState.joinDate && formDataState.treatmentDate) {
      const join = new Date(formDataState.joinDate);
      const treatment = new Date(formDataState.treatmentDate);
      if (!isNaN(join) && !isNaN(treatment) && treatment < join) {
        return "Treatment Date cannot be before the Policy Join Date.";
      }
    }
    if (!file) {
      return "Please select and upload a medical document file (bill/prescription).";
    }
    if (file.size > 10 * 1024 * 1024) {
      return "File size exceeds the 10MB limit. Please upload a smaller file.";
    }
    return null;
  };

  const handleUpload = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("memberId", formDataState.memberId);
    formData.append("memberName", formDataState.memberName);
    formData.append("treatmentDate", formDataState.treatmentDate);
    formData.append("claimAmount", formDataState.claimAmount);
    formData.append("hospitalName", formDataState.hospitalName);
    formData.append("joinDate", formDataState.joinDate);
    formData.append("cashlessRequest", formDataState.cashlessRequest);
    formData.append("networkHospital", formDataState.networkHospital);

    try {
      setLoading(true);
      const response = await API.post("/claims/upload", formData);
      navigate("/result", { state: response.data });
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <div className="upload-form">
        <div className="form-header">
          <h2>📋 Claim Details</h2>
          <p>Upload medical documents for automated adjudication</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="memberId">Member ID (Employee ID) *</label>
            <input
              id="memberId"
              type="text"
              name="memberId"
              placeholder="EMP001"
              value={formDataState.memberId}
              onChange={handleChange}
            />
            <span className="form-helper-text">Unique identifier of the employee</span>
          </div>

          <div className="form-group">
            <label htmlFor="memberName">Patient Name *</label>
            <input
              id="memberName"
              type="text"
              name="memberName"
              placeholder="Full name"
              value={formDataState.memberName}
              onChange={handleChange}
            />
            <span className="form-helper-text">Patient's name as it appears on documents</span>
          </div>

          <div className="form-group">
            <label htmlFor="treatmentDate">Treatment Date *</label>
            <input
              id="treatmentDate"
              type="date"
              name="treatmentDate"
              value={formDataState.treatmentDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="claimAmount">Claim Amount (₹) *</label>
            <input
              id="claimAmount"
              type="number"
              name="claimAmount"
              placeholder="1500"
              value={formDataState.claimAmount}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="hospitalName">Hospital Name</label>
            <input
              id="hospitalName"
              type="text"
              name="hospitalName"
              placeholder="Hospital name"
              value={formDataState.hospitalName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="joinDate">Join Date</label>
            <input
              id="joinDate"
              type="date"
              name="joinDate"
              value={formDataState.joinDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="checkboxes-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="cashlessRequest"
              checked={formDataState.cashlessRequest}
              onChange={handleChange}
            />
            <span>Cashless Request</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="networkHospital"
              checked={formDataState.networkHospital}
              onChange={handleChange}
            />
            <span>Network Hospital</span>
          </label>
        </div>

        <div className="file-upload-section">
          <h3>📄 Upload Documents</h3>
          <div className="file-upload-box">
            <div className="upload-icon">📤</div>
            <p className="upload-text">Drop files here or click to browse</p>
            <p className="upload-hint">Supports PDF, JPG, PNG • Max 10MB per file</p>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="file-input"
            />
            {file && (
              <div className="file-selected">
                ✅ {file.name}
              </div>
            )}
          </div>
        </div>

        <button
          className="btn btn-primary submit-btn"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-inline"></span>
              Processing...
            </>
          ) : (
            <>
              <span>⚡</span> Submit & Adjudicate
            </>
          )}
        </button>
      </div>

      <div className="upload-preview">
        <div className="preview-card">
          <div className="preview-icon">📋</div>
          <p>Submit a claim to see the adjudication result</p>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;