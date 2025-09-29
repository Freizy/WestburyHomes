import './App.css'
import { Toaster } from "react-hot-toast";
import Navbar from "./components/navbar";
import About from "./pages/About";
import Footer from './components/Footer';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from './pages/Home';
import Suites from "./pages/Properties";
import SuiteDetail from "./pages/PropertyDetail";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import AdminLogin from "./pages/AdminLogin";
import Access from './pages/Access';
import StaffPortal from './pages/StaffPortal';
//import AdminDashboard from './pages/AdminDashboard';



// Layout wrapper
const AppLayout = ({ children }) => {
  const location = useLocation();

  // Routes without navbar/footer
  const adminRoutes = ["/admin", "/admin-login", "/staff", "/access"];
  const isAdminRoute = adminRoutes.includes(location.pathname);

  const toasterConfig = {
    position: "top-right",
    toastOptions: {
      duration: 4000,
      style: { background: "#363636", color: "#fff" },
      success: {
        duration: 3000,
        iconTheme: { primary: "#10b981", secondary: "#fff" },
      },
      error: {
        duration: 5000,
        iconTheme: { primary: "#ef4444", secondary: "#fff" },
      },
    },
  };

  return isAdminRoute ? (
    <div className="App min-h-screen">
      {children}
      <Toaster {...toasterConfig} />
    </div>
  ) : (
    <div className="App min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Toaster {...toasterConfig} />
    </div>
  );
};


function App() {
  return (
    <BrowserRouter>
    <AppLayout>
      <Navbar/>
      <main className="App" style={{ minHeight: '60vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/suites" element={<Suites />} />
          <Route path="/suites/:id" element={<SuiteDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          {/*<Route path="/admin" element={<AdminDashboard />} />*/}
          <Route path="/access" element={<Access />} />
          <Route path="/staff" element={<StaffPortal />} />

        </Routes>
      </main>
      </AppLayout>
    </BrowserRouter>
  )
}

export default App
