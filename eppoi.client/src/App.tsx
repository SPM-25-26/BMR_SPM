import { useState, useEffect } from 'react';
import WelcomePage from './components/WelcomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';

interface User {
    name: string;
    userName: string;
    email: string;
}

const STORAGE_KEY = 'authenticatedUser';

export default function App() {
    const [currentPage, setCurrentPage] = useState<'welcome' | 'login' | 'register' | 'home'>('welcome');

    const [user, setUser] = useState<User | null>(() => {
        // Inizializza lo stato dal localStorage al primo render
        const storedUser = localStorage.getItem(STORAGE_KEY);
        if (storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch {
                return null;
            }
        }
        return null;
    });

    // Sync localStorage when user changes
    useEffect(() => {
        if (user) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            setCurrentPage('home');
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [user]);

    const [userName, setUserName] = useState('');

    const handleLogin = (userData: User) => {
        setUser(userData);
        setCurrentPage('home');
    };

    const handleLogout = () => {
        setUser(null);
        setCurrentPage('welcome');
    };

    const handleNavigateToLogin = () => {
        setCurrentPage('login');
    };

    const handleNavigateToRegister = () => {
        setCurrentPage('register');
    };

    const handleNavigateToWelcome = () => {
        setCurrentPage('welcome');
    };

    if (!user) {
        if (currentPage === 'login') {
            return (
                <LoginPage
                    onLogin={handleLogin}
                    onNavigateToRegister={handleNavigateToRegister}
                    onNavigateToWelcome={handleNavigateToWelcome}
                />
            );
        }
        if (currentPage === 'register') {
            return (
                <RegisterPage
                    onRegister={handleLogin}
                    onNavigateToLogin={handleNavigateToLogin}
                    onNavigateToWelcome={handleNavigateToWelcome}
                />
            );
        }
        return (
            <WelcomePage
                onNavigateToLogin={handleNavigateToLogin}
                onNavigateToRegister={handleNavigateToRegister}
            />
        );
    }

    return <HomePage user={user} onLogout={handleLogout} />;
}
