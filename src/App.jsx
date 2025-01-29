import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Cart from "./Pages/Cart/Cart";
import PlaceOrder from "./Pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopUp from "./components/LoginPopUp/LoginPopUp";
import { ToastContainer } from "react-toastify";
import { auth } from "./components/Firebase/firebase";

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
    {showLogin?<LoginPopUp  setShowLogin={setShowLogin} />:<></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route 
          path="/" 
          element={ <Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
        </Routes>
        <ToastContainer/>
      </div>
 
      <Footer />
    </>
  );
}

export default App;
