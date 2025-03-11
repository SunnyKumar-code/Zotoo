import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Cart from "./Pages/Cart/Cart";
import PlaceOrder from "./Pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopUp from "./components/LoginPopUp/LoginPopUp";
import { ToastContainer } from "react-toastify";
import Community from "./Pages/Community/Community";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/theme.css";

// ScrollToTop component to handle scrolling to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <ThemeProvider>
      {showLogin ? <LoginPopUp setShowLogin={setShowLogin} /> : <></>}
      <Navbar setShowLogin={setShowLogin} />
      <div className="app">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/community" element={<Community />} />
        </Routes>
        <ToastContainer />
      </div>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
