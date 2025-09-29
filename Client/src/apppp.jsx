import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Suites from "./pages/Properties";
import SuiteDetail from "./pages/PropertyDetail";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import StaffPortal from "./pages/StaffPortal";
import Access from "./pages/Access";
import "./index.css";


function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/suites" element={<Suites />} />
          <Route path="/suites/:id" element={<SuiteDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/staff" element={<StaffPortal />} />
          <Route path="/access" element={<Access />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
