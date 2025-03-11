import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { auth, db } from '../Firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import { RiUserCommunityLine } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("home");
    const [userData, setUserData] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);

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
                // If user data doesn't exist, create a basic user object from auth
                const user = auth.currentUser;
                if (user) {
                    setUserData({
                        email: user.email,
                        name: user.displayName || user.email.split('@')[0]
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            // Handle permission error gracefully
            if (error.code === 'permission-denied' || error.message.includes('Missing or insufficient permissions')) {
                console.log("Permission error. Using auth data instead.");
                // Use data from auth instead
                const user = auth.currentUser;
                if (user) {
                    setUserData({
                        email: user.email,
                        name: user.displayName || user.email.split('@')[0]
                    });

                    // Show a toast notification about the permission issue
                    toast.warning("Limited access mode: Some features may be restricted due to permission settings.", {
                        position: "bottom-center",
                        autoClose: 5000
                    });
                }
            }
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
            setShowUserMenu(false);
            toast.success("Successfully logged out!");
        } catch (error) {
            toast.error("Error logging out. Please try again.");
        }
    };

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showUserMenu && !event.target.closest('.user-profile')) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserMenu]);

    return (
        <div className="navbarmain">
            <div className="navbar">
                <Link to="/"><img src={assets.logo} alt="" className="logo" /></Link>
                <ul className="navbar-menu">
                    <Link to="/" onClick={() => { setMenu("home") }} className={menu === "home" ? "active" : ""}>Home</Link>
                    <a href='#explore-menu' onClick={() => { setMenu("menu") }} className={menu === "menu" ? "active" : ""}>Menu</a>
                    {/* <a href='#app-download' onClick={() => { setMenu("mobile-app") }} className={menu === "mobile-app" ? "active" : ""}>Mobile App</a> */}
                    <a href='#footer' onClick={() => { setMenu("contact-us") }} className={menu === "contact-us" ? "active" : ""}>Contact Us</a>
                </ul>
                <div className="navbar-right">
                    <Link to={"/community"}> <RiUserCommunityLine size={30} /></Link>
                    <div className="navbar-search-icon">
                        <Link to="/cart"><img src={assets.basket_icon} alt="" /></Link>
                        <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                    </div>

                    {userData ? (
                        <div className="user-profile">
                            <div className="user-avatar" onClick={() => setShowUserMenu(!showUserMenu)}>
                                <FaUserCircle size={30} />
                                <span className="user-name">{userData.name || userData.email.split('@')[0]}</span>
                            </div>

                            {showUserMenu && (
                                <div className="user-dropdown">
                                    <div className="user-info">
                                        <span>Signed in as</span>
                                        <strong>{userData.email}</strong>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={() => setShowLogin(true)} className="signin-btn">Sign in</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;