import React, { useRef, useState, useEffect } from "react";
import "./LoginPopUp.css";
import { assets } from "../../assets/assets";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth, db } from "../Firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import useScrollLock from "../../hooks/useScrollLock";

const LoginPopUp = ({ setShowLogin }) => {
    const [currState, setCurrState] = useState("Login");
    const [user, setUser] = useState(null);

    const refName = useRef();
    const refEmail = useRef();
    const refPassword = useRef();

    // Lock scroll when login popup is shown
    useScrollLock(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = refEmail.current.value;
        const password = refPassword.current.value;
        const name = refName.current ? refName.current.value : "";

        try {
            // Dismiss all active toasts before showing a new one
            toast.dismiss();

            if (currState === "Sign Up") {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const newUser = userCredential.user;

                // Update the user's display name in Firebase Auth
                if (name) {
                    try {
                        await updateProfile(newUser, { displayName: name });
                    } catch (profileError) {
                        console.error("Error updating profile:", profileError);
                    }
                }

                if (newUser) {
                    try {
                        await setDoc(doc(db, "Users", newUser.uid), {
                            email: newUser.email,
                            name: name,
                        });
                    } catch (firestoreError) {
                        console.error("Firestore error:", firestoreError);
                        // Continue with the sign-up process even if Firestore fails
                        if (firestoreError.code === 'permission-denied' || firestoreError.message.includes('Missing or insufficient permissions')) {
                            toast.warning("User created but profile data couldn't be saved to database. Some features may be limited.", {
                                position: "top-center",
                                autoClose: 5000
                            });
                        }
                    }
                }
                toast.success("User Registered Successfully!", { position: "top-center", autoClose: 3000 });
            } else {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                toast.success("Logged in Successfully!", { position: "top-center", autoClose: 3000 });
            }

            setShowLogin(false);
        } catch (error) {
            console.error("Error:", error);

            // Provide more user-friendly error messages
            let errorMessage = error.message;
            if (error.code === 'auth/network-request-failed') {
                errorMessage = "Network error. Please check your internet connection.";
            } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = "Invalid email or password.";
            } else if (error.code === 'auth/email-already-in-use') {
                errorMessage = "This email is already registered. Please login instead.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Password is too weak. Please use a stronger password.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email format.";
            }

            toast.error(errorMessage, { position: "bottom-center", autoClose: 3000 });
        }
    };

    return (
        <div className="login-popup">
            <form onSubmit={handleSubmit} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Sign Up" && <input type="text" ref={refName} placeholder="Your Name" required />}
                    <input ref={refEmail} type="email" placeholder="Your Email" required />
                    <input ref={refPassword} type="password" placeholder="Password" required />
                </div>
                <button type="submit">{currState === "Sign Up" ? "Create account" : "Login"}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
                {currState === "Login" ? (
                    <p>
                        Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span>
                    </p>
                ) : (
                    <p>
                        Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span>
                    </p>
                )}
            </form>
        </div>
    );
};

export default LoginPopUp;
