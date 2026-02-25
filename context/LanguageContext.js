'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('al-dalal-lang');
        if (savedLang) {
            setLang(savedLang);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('al-dalal-lang', lang);
        // Set document direction and lang attribute
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    }, [lang]);

    const toggleLanguage = () => {
        setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
