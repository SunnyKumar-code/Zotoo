import React, { useRef, useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { auth, db } from '../../components/Firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify CSS
import './Community.css';

function Community() {
    const bodyRef = useRef(null);
    const [userData, setUserData] = useState(null);
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasPermissionError, setHasPermissionError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const commentsCollectionRef = collection(db, "comments");

    // Enable offline persistence for Firestore
    useEffect(() => {
        const enablePersistence = async () => {
            try {
                // This is now handled in the firebase.js file
                console.log("Firestore persistence already configured");
            } catch (err) {
                if (err.code === 'failed-precondition') {
                    // Multiple tabs open, persistence can only be enabled in one tab at a time
                    console.log('Persistence failed: Multiple tabs open');
                } else if (err.code === 'unimplemented') {
                    // The current browser does not support persistence
                    console.log('Persistence not supported by browser');
                }
            }
        };

        enablePersistence();
    }, []);

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
                const user = auth.currentUser;
                if (user) {
                    setUserData({
                        email: user.email,
                        name: user.displayName || user.email.split('@')[0]
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

    const fetchComments = () => {
        setIsLoading(true);
        try {
            const q = query(commentsCollectionRef, orderBy("createdAt", "desc"));
            const unsubscribe = onSnapshot(
                q,
                (querySnapshot) => {
                    const commentsArray = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id
                    }));
                    setComments(commentsArray);
                    setIsLoading(false);
                    setHasPermissionError(false);
                    setRetryCount(0); // Reset retry count on success
                },
                (error) => {
                    console.error("Error fetching comments:", error);
                    setIsLoading(false);

                    if (error.code === 'permission-denied' || error.message.includes('Missing or insufficient permissions')) {
                        setHasPermissionError(true);

                        // Only show toast on first error
                        if (retryCount === 0) {
                            toast.error("Unable to load comments due to permission restrictions.", {
                                position: "top-right",
                                autoClose: 5000
                            });
                        }

                        // Retry up to 3 times with increasing delay
                        if (retryCount < 3) {
                            const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
                            console.log(`Retrying in ${delay}ms (attempt ${retryCount + 1}/3)`);

                            setTimeout(() => {
                                setRetryCount(prev => prev + 1);
                                // This will trigger the useEffect below to retry
                            }, delay);
                        }
                    }
                }
            );

            return unsubscribe;
        } catch (error) {
            console.error("Error setting up comments listener:", error);
            setIsLoading(false);
            if (error.code === 'permission-denied' || error.message.includes('Missing or insufficient permissions')) {
                setHasPermissionError(true);
            }
            return () => { }; // Return empty function as fallback
        }
    };

    // Fetch comments and retry based on retryCount
    useEffect(() => {
        const unsubscribe = fetchComments();
        return () => unsubscribe();
    }, [retryCount]);

    const onFormSubmit = async (e) => {
        e.preventDefault();
        const commentBody = bodyRef.current.value.trim();

        if (!commentBody) {
            toast.error("Please enter a comment.", { position: "top-right" });
            return;
        }

        if (hasPermissionError) {
            toast.error("Cannot post comments due to permission restrictions.", { position: "top-right" });
            return;
        }

        const comment = {
            body: commentBody,
            createdBy: userData?.name || "Anonymous",
            createdAt: new Date(),
        };

        try {
            await addDoc(commentsCollectionRef, comment);
            bodyRef.current.value = "";
            toast.success("Comment posted successfully!", { position: "top-right" });
        } catch (err) {
            console.error("ERROR CREATING NEW COMMENT IN DB", err);
            if (err.code === 'permission-denied' || err.message.includes('Missing or insufficient permissions')) {
                toast.error("Cannot post comments due to permission restrictions.", { position: "top-right" });
                setHasPermissionError(true);
            } else {
                toast.error("Failed to post comment. Please try again.", { position: "top-right" });
            }
        }
    };

    const handleRetryConnection = () => {
        setRetryCount(0); // Reset retry count
        setHasPermissionError(false);
        setIsLoading(true);
        toast.info("Attempting to reconnect to the database...", { position: "top-right" });
        // This will trigger the useEffect to retry the connection
    };

    return (
        <div className="community-page">
            <ToastContainer /> {/* Toast Container for notifications */}
            <h1>Community Comments</h1>

            {hasPermissionError && (
                <div className="permission-error-banner">
                    <p>
                        <strong>Limited Access Mode:</strong> Due to permission restrictions, you cannot view or post comments.
                        This may be due to ad blockers or firewall settings blocking Firebase connections.
                    </p>
                    <button className="retry-button" onClick={handleRetryConnection}>
                        Retry Connection
                    </button>
                </div>
            )}

            <div className="comment-form">
                <h2>Post a Comment</h2>
                <form onSubmit={onFormSubmit}>
                    <textarea
                        ref={bodyRef}
                        placeholder="Write your comment here..."
                        required
                        disabled={hasPermissionError}
                    ></textarea>
                    <button type="submit" disabled={hasPermissionError}>Post Comment</button>
                </form>
            </div>

            <div className="comments-list">
                <h2>Recent Comments</h2>
                {isLoading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Loading comments...</p>
                    </div>
                ) : hasPermissionError ? (
                    <p>Comments cannot be loaded due to permission restrictions.</p>
                ) : comments.length > 0 ? (
                    comments.map((comment) => {
                        const formattedDate = comment.createdAt?.toDate
                            ? comment.createdAt.toDate().toLocaleString()
                            : "Unknown Date";
                        return (
                            <div key={comment.id} className="comment-item">
                                <p className="comment-body">{comment.body}</p>
                                <p className="comment-meta">
                                    Posted by <strong>{comment.createdBy}</strong> on {formattedDate}
                                </p>
                            </div>
                        );
                    })
                ) : (
                    <p>No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    );
}

export default Community;
