import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Cart from "./Pages/Cart/Cart";
import PlaceOrder from "./Pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopUp from "./components/LoginPopUp/LoginPopUp";
import { ToastContainer } from "react-toastify";


import Community from "./Pages/Community/Community";

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
    {showLogin?<LoginPopUp  setShowLogin={setShowLogin} />:<></>}
    <Navbar setShowLogin={setShowLogin} />
      <div className="app">
       
        <Routes>
          <Route 
          path="/" 
          element={ <Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/community" element={<Community/>} />
        </Routes>
        <ToastContainer/>
      </div>
 
      <Footer />
    </>
  );
}

export default App;
