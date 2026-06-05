import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleProvider } from "./context/RoleContext";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import UploadClaim from "./pages/UploadClaim";
import Result from "./pages/Result";
import ClaimHistory from "./pages/ClaimHistory";
import PolicyTerms from "./pages/PolicyTerms";
import ReviewClaims from "./pages/ReviewClaims";
import "./App.css";

function App() {
  return (
    <RoleProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          
  <Route path="/" element={<Home />} />
  <Route path="/upload" element={<UploadClaim />} />
  <Route path="/result" element={<Result />} />
  <Route path="/history" element={<ClaimHistory />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/policy" element={<PolicyTerms />} />
  <Route path="/review" element={<ReviewClaims />} />

        </Routes>
      </BrowserRouter>
    </RoleProvider>
  );
}

export default App;