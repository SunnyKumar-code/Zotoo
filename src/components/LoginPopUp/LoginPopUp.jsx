import React, { useRef, useState, useEffect } from "react";
import "./LoginPopUp.css";
import { assets } from "../../assets/assets";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../Firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const LoginPopUp = ({ setShowLogin }) => {
    const [currState, setCurrState] = useState("Login");
    const [user, setUser] = useState(null); // Track user login state

    const refName = useRef();
    const refEmail = useRef();
    const refPassword = useRef();

    // Track user authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

    // Handle Login & Registration
    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = refEmail.current.value;
        const password = refPassword.current.value;
        const name = refName.current ? refName.current.value : "";

        try {
            if (currState === "Sign Up") {
               
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const newUser = userCredential.user;

                if (newUser) {
                    await setDoc(doc(db, "Users", newUser.uid), {
                        email: newUser.email,
                        name: name,
                    });
                }
                toast.success("User Registered Successfully!", { position: "top-center" });
            } else {
              
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                toast.success("Logged in Successfully!", { position: "top-center" });
            }

            setShowLogin(false); 
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message, { position: "bottom-center" });
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
