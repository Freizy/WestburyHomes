import './App.css'
import { Toaster } from "react-hot-toast";
import Navbar from "./components/navbar";
import About from "./pages/About";
import Footer from './components/Footer';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from './pages/Home';

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
      <Navbar/>
      <main className="App" style={{ minHeight: '60vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/suites" element={<h1 className='text-3xl font-bold underline'>Suites Page</h1>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<h1 className='text-3xl font-bold underline'>Contact Page</h1>} />
          <Route path="/booking" element={<h1 className='text-3xl font-bold underline'>Booking Page</h1>} />
        </Routes>
      </main>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
