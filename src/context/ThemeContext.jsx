import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Check if user has a theme preference stored in localStorage
    const storedTheme = localStorage.getItem('theme');
    const [isDarkMode, setIsDarkMode] = useState(storedTheme === 'dark');

    // Toggle theme function
    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    // Update localStorage and apply theme class to body when theme changes
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}; 