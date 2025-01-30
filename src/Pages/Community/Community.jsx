import React, { useRef, useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../components/Firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify CSS
import './Community.css'; 

function Community() {
    const bodyRef = useRef(null);
    const [userData, setUserData] = useState(null);
    const [comments, setComments] = useState([]);
    const commentsCollectionRef = collection(db, "comments");

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
            console.error("Error fetching user data:", error);
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

    useEffect(() => {
        const q = query(commentsCollectionRef, orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const commentsArray = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setComments(commentsArray);
        });

        return () => unsubscribe();
    }, []);

    const onFormSubmit = async (e) => {
        e.preventDefault();
        const commentBody = bodyRef.current.value.trim();

        if (!commentBody) {
            toast.error("Please enter a comment.", { position: "top-right" });
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
            toast.error("Failed to post comment. Please try again.", { position: "top-right" });
        }
    };

    return (
        <div className="community-page">
            <ToastContainer /> {/* Toast Container for notifications */}
            <h1>Community Comments</h1>
            <div className="comment-form">
                <h2>Post a Comment</h2>
                <form onSubmit={onFormSubmit}>
                    <textarea ref={bodyRef} placeholder="Write your comment here..." required></textarea>
                    <button type="submit">Post Comment</button>
                </form>
            </div>
            <div className="comments-list">
                <h2>Recent Comments</h2>
                {comments.length > 0 ? (
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
