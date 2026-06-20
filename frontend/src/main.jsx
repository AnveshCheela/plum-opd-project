import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// --- OpsGuardian Client SDK ---
(function() {
  const OPSGUARDIAN_URL = import.meta.env.VITE_OPSGUARDIAN_API_URL || 'http://localhost:5000/api/v1/webhooks/trigger';
  const WEBHOOK_KEY = import.meta.env.VITE_OPSGUARDIAN_WEBHOOK_KEY || 'YOUR_WEBHOOK_KEY_HERE';

  if (!WEBHOOK_KEY || WEBHOOK_KEY === 'YOUR_WEBHOOK_KEY_HERE') {
    console.warn('[OpsGuardian] Tracker disabled: Missing VITE_OPSGUARDIAN_WEBHOOK_KEY environment variable.');
    return;
  }

  function reportCrashToOpsGuardian(errorMsg, errorStack, url) {
    console.log('[OpsGuardian] Catching frontend crash and reporting to backend...');
    const payload = {
      webhookKey: WEBHOOK_KEY,
      alert: 'Plum OPD Frontend Client Crash',
      severity: 'Critical',
      errorMessage: errorMsg,
      errorStack: errorStack,
      url: url,
      rawLog: `Plum OPD Frontend Crash:\nMessage: ${errorMsg}\nURL: ${url}\nStack: ${errorStack}`
    };

    fetch(OPSGUARDIAN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.error('[OpsGuardian] Network error:', err));
  }

  window.onerror = function(message, source, lineno, colno, error) {
    const stack = error ? error.stack : 'No stack trace available';
    reportCrashToOpsGuardian(message, stack, window.location.href);
    return false;
  };

  window.addEventListener('unhandledrejection', function(event) {
    const errorMsg = event.reason ? event.reason.message || event.reason : 'Unhandled Promise Rejection';
    const stack = event.reason && event.reason.stack ? event.reason.stack : 'No stack trace available';
    reportCrashToOpsGuardian(errorMsg, stack, window.location.href);
  });

  window.triggerTestCrash = function() {
    console.log("Intentional frontend crash triggered!");
    // eslint-disable-next-line no-undef
    const price = undefinedVariable * 100; // ReferenceError
  };
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
