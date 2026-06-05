import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            AI-Powered Insurance Claim Adjudication
          </h1>
          <p className="hero-subtitle">
            Instantly process, validate, and adjudicate medical insurance claims using advanced AI and rule-based automation
          </p>
          <div className="hero-buttons">
            <Link to="/upload" className="btn btn-primary btn-lg">
              <span>🚀</span> Submit Your Claim
            </Link>

          </div>
        </div>
        <div className="hero-graphic">
          <div className="floating-card card-1">
            <div className="card-icon">📋</div>
            <p>Document Upload</p>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">🤖</div>
            <p>AI Analysis</p>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">✅</div>
            <p>Instant Decision</p>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title text-center">Why Choose Plum OPD?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Process claims in seconds with AI-powered automation</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>99% Accurate</h3>
              <p>Advanced ML models trained on thousands of claims</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Compliant</h3>
              <p>Enterprise-grade security with full audit trails</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Analytics & Insights</h3>
              <p>Real-time dashboards with actionable insights</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Rule-Based Logic</h3>
              <p>Customizable adjudication rules for your policies</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Ready</h3>
              <p>Access claims on the go with mobile app</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Transform Your Claims Process?</h2>
          <p>Start processing claims instantly with our AI-powered adjudication system</p>
          <Link to="/upload" className="btn btn-primary btn-lg">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;