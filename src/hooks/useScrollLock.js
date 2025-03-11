import { useEffect } from 'react';

/**
 * Custom hook to lock/unlock body scroll
 * Useful for modals, popups, and other overlays
 */
const useScrollLock = (lock = false) => {
    useEffect(() => {
        // Save the original body style
        const originalStyle = window.getComputedStyle(document.body).overflow;

        // Function to prevent scrolling
        const preventScroll = (e) => {
            if (lock) {
                e.preventDefault();
            }
        };

        if (lock) {
            // Lock scroll
            document.body.style.overflow = 'hidden';

            // For touch devices
            document.addEventListener('touchmove', preventScroll, { passive: false });
        }

        // Cleanup function to restore original style
        return () => {
            document.body.style.overflow = originalStyle;
            document.removeEventListener('touchmove', preventScroll);
        };
    }, [lock]); // Re-run effect when lock changes
};

export default useScrollLock; 