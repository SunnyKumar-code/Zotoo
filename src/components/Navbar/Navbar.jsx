import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { auth, db } from '../Firebase/firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from 'react-toastify';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("home");
    const [userData, setUserData] = useState(null); 

    const { getTotalCartAmount } = useContext(StoreContext);


    const fetchUserData = async (uid) => {
        try {
            const docRef = doc(db, "Users", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserData(docSnap.data());
                console.log(docSnap.data());
            } else {
                console.log("User data not found in Firestore.");
            }
        } catch (error) {
            console.log("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                fetchUserData(currentUser.uid);
            } else {
                setUserData(null); 
            }
        });
        return () => unsubscribe(); 
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUserData(null);
            toast.success("Successfully logged out!",{
                position:"top-center"
            }); 
        } catch (error) {
            toast.error("Error logging out. Please try again."); 
        }
    };

    return (
        <div className="navbar">
            <Link to="/"><img src={assets.logo} alt="" className="logo" /></Link>
            <ul className="navbar-menu">
                <Link to="/" onClick={() => { setMenu("home") }} className={menu === "home" ? "active" : ""}>Home</Link>
                <a href='#explore-menu' onClick={() => { setMenu("menu") }} className={menu === "menu" ? "active" : ""}>Menu</a>
                <a href='#app-download' onClick={() => { setMenu("mobile-app") }} className={menu === "mobile-app" ? "active" : ""}>Mobile App</a>
                <a href='#footer' onClick={() => { setMenu("contact-us") }} className={menu === "contact-us" ? "active" : ""}>Contact Us</a>
            </ul>
            <div className="navbar-right">
                <img src={assets.search_icon} alt="" />
                <div className="navbar-search-icon">
                    <Link to="/cart"><img src={assets.basket_icon} alt="" /></Link>
                    <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                </div>
                {userData ? (
                    <div className="user-info">
                        <span>Hello, {userData.name || userData.email}</span> 
                        <button onClick={handleLogout}>Logout</button> 
                    </div>
                ) : (
                    <button onClick={() => setShowLogin(true)}>Sign in</button> 
                )}
            </div>
        </div>
    );
};

export default Navbar;
