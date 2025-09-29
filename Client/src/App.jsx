import './App.css'
import Navbar from "./components/navbar";
import Footer from './components/Footer';
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <main className="App" style={{ minHeight: '60vh' }}>
        <Routes>
          <Route path="/" element={<h1 className='text-3xl font-bold underline'>Home Page</h1>} />
          <Route path="/suites" element={<h1 className='text-3xl font-bold underline'>Suites Page</h1>} />
          <Route path="/about" element={<h1 className='text-3xl font-bold underline'>About Us</h1>} />
          <Route path="/contact" element={<h1 className='text-3xl font-bold underline'>Contact Page</h1>} />
          <Route path="/booking" element={<h1 className='text-3xl font-bold underline'>Booking Page</h1>} />
        </Routes>
      </main>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
