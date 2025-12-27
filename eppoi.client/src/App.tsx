import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import EmailVerification from './components/EmailVerification';
import EmailVerificationRequired from './components/EmailVerificationRequired';
import DetailPage from './components/DetailPage';
import WelcomePage from './components/WelcomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';
import ResetPasswordPage from './components/ResetPasswordPage';
import OnboardingWizard from './components/OnboardingWizard';

interface User {
    name: string;
    userName: string;
    email: string;
    emailConfirmed: boolean;
}

const STORAGE_KEY = 'authenticatedUser';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Protected Route - only authenticated users
interface ProtectedRouteProps {
    children: React.ReactNode;
    user: User | null;
}

function ProtectedRoute({ children, user }: ProtectedRouteProps) {
  return user ? (user.emailConfirmed ? children : <Navigate to="/needs-verification" replace />) : <Navigate to="/welcome" replace />;
}

// Public Route - redirect to home if already authenticated
interface PublicRouteProps {
    children: React.ReactNode;
    user: User | null;
}

function PublicRoute({ children, user }: PublicRouteProps) {
    return !user ? children : <Navigate to="/" replace />;
}

// Mail to confirm Route - redirect to verify email message if authenticated but still not verified
//needs-verification
interface MailToVerifyRouteProps {
  children: React.ReactNode;
  user: User | null;
}

function MailToVerifyRoute({ children, user }: ProtectedRouteProps) {
  return user && !user.emailConfirmed ? children : <Navigate to="/" replace />;
}


export default function App() {
    const [user, setUser] = useState<User | null>(() => {
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

    useEffect(() => {
        if (user) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem('authToken');
        }
    }, [user]);

    const handleLogin = (userData: User) => {
        setUser(userData);
    };

  const handleOnboardingComplete = () => {
    // Navigate to home page after onboarding completion
    window.location.href = '/';
  };

  const handleLogout = () => {
        localStorage.removeItem('authenticatedUser');
        localStorage.removeItem('authToken');
        setUser(null);
    };

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <Router>
                <Routes>
                    <Route
                        path="/welcome"
                        element={
                            <PublicRoute user={user}>
                                <WelcomePage onLogin={handleLogin} />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <PublicRoute user={user}>
                                <LoginPage onLogin={handleLogin} />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <PublicRoute user={user}>
                                <RegisterPage onRegister={handleLogin} />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/recover-password"
                        element={
                            <PublicRoute user={user}>
                                <ForgotPasswordPage />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/reset-password"
                        element={
                            <PublicRoute user={user}>
                                <ResetPasswordPage />
                            </PublicRoute>
                        }
                    />                    
                    <Route
                        path="/verify-email"
                        element={
                          <EmailVerification onLogin={handleLogin} />
                        }
                    />
                    <Route
                        path="/needs-verification"
                        element={
                          <MailToVerifyRoute user={user}>
                            <EmailVerificationRequired user={user} onLogout={handleLogout} />
                            </MailToVerifyRoute>
                        }
                    />
                    <Route
                        path="/onboarding"
                        element={
                            <ProtectedRoute user={user}>
                                <OnboardingWizard 
                                    userName={user?.name || ''} 
                                    onComplete={handleOnboardingComplete} 
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute user={user}>
                            <HomePage user={user} onLogout={handleLogout} userPreferences={{ interests: ['arte-cultura', 'eventi'], travelStyle: '', dietaryNeeds: [] }} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/detail"
                        element={
                            <ProtectedRoute user={user}>
                              <DetailPage onLogout={handleLogout} />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
}
