import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './UserDropdown.css';

const UserDropdown = ({ userData, onLogout, isOpen, onClose }) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Create a function to handle clicks outside the dropdown
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        // Add event listener when dropdown is open
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Clean up the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // If dropdown is not open, don't render anything
    if (!isOpen) return null;

    // Create portal to render dropdown at the root level of the DOM
    return ReactDOM.createPortal(
        <div className="user-dropdown-overlay">
            <div
                className="user-dropdown-portal"
                ref={dropdownRef}
                style={{
                    position: 'fixed',
                    top: '70px', // Adjust based on your navbar height
                    right: '20px',
                    width: '220px',
                    backgroundColor: 'var(--dropdown-bg)',
                    color: 'var(--text-primary)',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px var(--shadow-color)',
                    zIndex: 9999,
                    overflow: 'hidden',
                    animation: 'dropdown-appear 0.2s ease-out',
                    border: '1px solid var(--border-color)'
                }}
            >
                <div className="user-info" style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: 0 }}>Signed in as</span>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '14px', wordBreak: 'break-all' }}>
                        {userData.email}
                    </strong>
                </div>
                <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: 0 }}></div>
                <button
                    onClick={onLogout}
                    style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '12px 15px',
                        border: 'none',
                        borderRadius: 0,
                        color: 'var(--accent-color)',
                        fontWeight: 500,
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'var(--hover-bg)'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    Logout
                </button>
            </div>
        </div>,
        document.body
    );
};

export default UserDropdown; 