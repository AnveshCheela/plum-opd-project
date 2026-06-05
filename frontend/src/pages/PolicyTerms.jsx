import React, { useState } from 'react';
import policyData from '../data/policy_terms.json';
import './PolicyTerms.css';

export default function PolicyTerms() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const policy = policyData;

  return (
    <div className="policy-page">
      <div className="policy-header">
        <h1>📋 Policy Terms & Conditions</h1>
        <p>Plum OPD Advantage - Comprehensive Coverage Details</p>
      </div>

      <div className="policy-wrapper">
        {/* Policy Overview */}
        <section className="policy-section">
          <h2>Policy Overview</h2>
          <div className="overview-grid">
            <div className="overview-card">
              <span className="card-icon">📄</span>
              <h3>Policy Name</h3>
              <p>{policy.policy_name}</p>
            </div>
            <div className="overview-card">
              <span className="card-icon">🏢</span>
              <h3>Company</h3>
              <p>{policy.policy_holder.company}</p>
            </div>
            <div className="overview-card">
              <span className="card-icon">👥</span>
              <h3>Employees</h3>
              <p>{policy.policy_holder.employees_covered}</p>
            </div>
            <div className="overview-card">
              <span className="card-icon">📅</span>
              <h3>Effective Date</h3>
              <p>{policy.effective_date}</p>
            </div>
          </div>
        </section>

        {/* Coverage Limits */}
        <section className="policy-section">
          <div className="section-header" onClick={() => toggleSection('coverage')}>
            <h2>💰 Coverage Limits</h2>
            <span className={`expand-icon ${expandedSection === 'coverage' ? 'open' : ''}`}>▼</span>
          </div>
          {expandedSection === 'coverage' && (
            <div className="section-content">
              <div className="limits-grid">
                <div className="limit-card">
                  <span className="limit-label">Annual Limit</span>
                  <span className="limit-value">₹{policy.coverage_details.annual_limit.toLocaleString()}</span>
                </div>
                <div className="limit-card">
                  <span className="limit-label">Per Claim Limit</span>
                  <span className="limit-value">₹{policy.coverage_details.per_claim_limit.toLocaleString()}</span>
                </div>
                <div className="limit-card">
                  <span className="limit-label">Family Floater</span>
                  <span className="limit-value">₹{policy.coverage_details.family_floater_limit.toLocaleString()}</span>
                </div>
              </div>

              {/* Service Coverage */}
              <div className="coverage-details">
                <h3>🏥 Consultation Fees</h3>
                <p><strong>Covered:</strong> {policy.coverage_details.consultation_fees.covered ? '✅ Yes' : '❌ No'}</p>
                <p><strong>Sub Limit:</strong> ₹{policy.coverage_details.consultation_fees.sub_limit}</p>
                <p><strong>Copay:</strong> {policy.coverage_details.consultation_fees.copay_percentage}%</p>
                <p><strong>Network Discount:</strong> {policy.coverage_details.consultation_fees.network_discount}%</p>

                <h3>🔬 Diagnostic Tests</h3>
                <p><strong>Covered:</strong> {policy.coverage_details.diagnostic_tests.covered ? '✅ Yes' : '❌ No'}</p>
                <p><strong>Sub Limit:</strong> ₹{policy.coverage_details.diagnostic_tests.sub_limit}</p>
                <p><strong>Pre-Authorization:</strong> {policy.coverage_details.diagnostic_tests.pre_authorization_required ? '✅ Required' : '❌ Not Required'}</p>
                <p><strong>Covered Tests:</strong></p>
                <div className="tags-container">
                  {policy.coverage_details.diagnostic_tests.covered_tests.map((test, idx) => (
                    <span key={idx} className="tag">{test}</span>
                  ))}
                </div>

                <h3>💊 Pharmacy</h3>
                <p><strong>Sub Limit:</strong> ₹{policy.coverage_details.pharmacy.sub_limit}</p>
                <p><strong>Generic Mandatory:</strong> {policy.coverage_details.pharmacy.generic_drugs_mandatory ? '✅ Yes' : '❌ No'}</p>
                <p><strong>Branded Drugs Copay:</strong> {policy.coverage_details.pharmacy.branded_drugs_copay}%</p>

                <h3>🦷 Dental Care</h3>
                <p><strong>Sub Limit:</strong> ₹{policy.coverage_details.dental.sub_limit}</p>
                <p><strong>Covered Procedures:</strong></p>
                <div className="tags-container">
                  {policy.coverage_details.dental.procedures_covered.map((proc, idx) => (
                    <span key={idx} className="tag">{proc}</span>
                  ))}
                </div>

                <h3>👁️ Vision Care</h3>
                <p><strong>Sub Limit:</strong> ₹{policy.coverage_details.vision.sub_limit}</p>
                <p><strong>Eye Test:</strong> {policy.coverage_details.vision.eye_test_covered ? '✅ Covered' : '❌ Not Covered'}</p>
                <p><strong>Glasses/Lenses:</strong> {policy.coverage_details.vision.glasses_contact_lenses ? '✅ Covered' : '❌ Not Covered'}</p>
              </div>
            </div>
          )}
        </section>

        {/* Waiting Periods */}
        <section className="policy-section">
          <div className="section-header" onClick={() => toggleSection('waiting')}>
            <h2>⏳ Waiting Periods</h2>
            <span className={`expand-icon ${expandedSection === 'waiting' ? 'open' : ''}`}>▼</span>
          </div>
          {expandedSection === 'waiting' && (
            <div className="section-content">
              <div className="waiting-grid">
                <div className="waiting-card">
                  <span className="waiting-label">Initial Waiting</span>
                  <span className="waiting-value">{policy.waiting_periods.initial_waiting} days</span>
                </div>
                <div className="waiting-card">
                  <span className="waiting-label">Pre-existing Diseases</span>
                  <span className="waiting-value">{policy.waiting_periods.pre_existing_diseases} days</span>
                </div>
                <div className="waiting-card">
                  <span className="waiting-label">Maternity</span>
                  <span className="waiting-value">{policy.waiting_periods.maternity} days</span>
                </div>
              </div>

              <div className="specific-ailments">
                <h3>Specific Ailments Waiting Periods:</h3>
                <ul className="ailments-list">
                  {Object.entries(policy.waiting_periods.specific_ailments).map(([ailment, days]) => (
                    <li key={ailment}>
                      <span className="ailment-name">{ailment.charAt(0).toUpperCase() + ailment.slice(1)}</span>
                      <span className="ailment-days">{days} days</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* Exclusions */}
        <section className="policy-section">
          <div className="section-header" onClick={() => toggleSection('exclusions')}>
            <h2>❌ Exclusions</h2>
            <span className={`expand-icon ${expandedSection === 'exclusions' ? 'open' : ''}`}>▼</span>
          </div>
          {expandedSection === 'exclusions' && (
            <div className="section-content">
              <ul className="exclusions-list">
                {policy.exclusions.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Claim Requirements */}
        <section className="policy-section">
          <div className="section-header" onClick={() => toggleSection('requirements')}>
            <h2>📝 Claim Requirements</h2>
            <span className={`expand-icon ${expandedSection === 'requirements' ? 'open' : ''}`}>▼</span>
          </div>
          {expandedSection === 'requirements' && (
            <div className="section-content">
              <h3>Required Documents:</h3>
              <ul className="requirements-list">
                {policy.claim_requirements.documents_required.map((doc, idx) => (
                  <li key={idx}>✓ {doc}</li>
                ))}
              </ul>
              <p><strong>Submission Timeline:</strong> {policy.claim_requirements.submission_timeline_days} days</p>
              <p><strong>Minimum Claim Amount:</strong> ₹{policy.claim_requirements.minimum_claim_amount}</p>
            </div>
          )}
        </section>

        {/* Network Hospitals */}
        <section className="policy-section">
          <div className="section-header" onClick={() => toggleSection('hospitals')}>
            <h2>🏥 Network Hospitals</h2>
            <span className={`expand-icon ${expandedSection === 'hospitals' ? 'open' : ''}`}>▼</span>
          </div>
          {expandedSection === 'hospitals' && (
            <div className="section-content">
              <div className="hospitals-grid">
                {policy.network_hospitals.map((hospital, idx) => (
                  <div key={idx} className="hospital-card">{hospital}</div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
