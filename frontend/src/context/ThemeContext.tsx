import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('theme');
        return (saved as Theme) || 'system';
    });

    useEffect(() => {
        const applyTheme = () => {
            const root = window.document.documentElement;
            // Determine if we should be in dark mode
            const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

            // Toggle the .dark class
            root.classList.toggle('dark', isDark);

            // Set the color-scheme property for browser UI elements (scroller, etc)
            root.style.colorScheme = isDark ? 'dark' : 'light';

            // Persist the choice
            localStorage.setItem('theme', theme);

            console.log(`[Theme] Current: ${theme}, Effective: ${isDark ? 'dark' : 'light'}`);
        };

        applyTheme();

        // If in system mode, listen for external changes (OS level)
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => {
                console.log('[Theme] System theme changed detected');
                applyTheme();
            };

            // Modern browsers use addEventListener
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
