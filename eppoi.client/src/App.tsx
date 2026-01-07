import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { STORAGE_AUTHTOKEN_KEY, type UserPreferences } from './api/apiUtils';
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

const STORAGE_USER_KEY = 'authenticatedUser';
const STORAGE_USERPREFERENCES_KEY = 'userPreferences';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Protected Route - only authenticated users
interface ProtectedRouteProps {
    children: React.ReactNode;
    user: User | null;
}

interface UserConfirmedRouteProps {
  children: React.ReactNode;
  user: User | null;
  userPreferences: UserPreferences;
}

// Registered user rout - needs a registered, mail verified user
function RegisteredUserRoute({ children, user }: ProtectedRouteProps) {
  return user ? (user.emailConfirmed ? children : <Navigate to="/needs-verification" replace />) : <Navigate to="/welcome" replace />;
}

// Protected route - needs a registered, mail verified user, that already has set his preferences
function ProtectedRoute({ children, user, userPreferences }: UserConfirmedRouteProps) {
  if (!user) {
    return <Navigate to="/welcome" replace />;
}

  if (!user.emailConfirmed) {
    return <Navigate to="/needs-verification" replace />;
  }
  
  let hasPreferences = false;
  if (userPreferences) {
    hasPreferences = Array.isArray(userPreferences.interests) && userPreferences.interests.length > 0;
  }
  
  return (hasPreferences ? children : <Navigate to="/onboarding" replace />);
}

// Public Route - redirect to home if already authenticated
function PublicRoute({ children, user }: ProtectedRouteProps) {
    return !user ? children : <Navigate to="/" replace />;
}

// Mail to confirm Route - redirect to verify email message if authenticated but still not verified
//needs-verification
function MailToVerifyRoute({ children, user }: ProtectedRouteProps) {
  return user && !user.emailConfirmed ? children : <Navigate to="/" replace />;
}


export default function App() {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem(STORAGE_USER_KEY);
        if (storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch {
                return null;
            }
        }
        return null;
    });

    const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(() => {
        const storedUserPreferences = localStorage.getItem(STORAGE_USERPREFERENCES_KEY);
        if (storedUserPreferences) {
            try {
                return JSON.parse(storedUserPreferences);
            } catch {
                return null;
            }
      }

        return null;
    });

    const manifestLoaded = useRef(false);

    useEffect(() => {
        if (user) {
            localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
            localStorage.setItem(STORAGE_USERPREFERENCES_KEY, JSON.stringify(userPreferences));
        } else {
            localStorage.removeItem(STORAGE_USER_KEY);
            localStorage.removeItem(STORAGE_USERPREFERENCES_KEY);
            localStorage.removeItem(STORAGE_AUTHTOKEN_KEY);
        }
    }, [user]);

    useEffect(() => {
        if (userPreferences) {
            localStorage.setItem(STORAGE_USERPREFERENCES_KEY, JSON.stringify(userPreferences));
        }
    }, [userPreferences]);

    const handleLogin = (userData: User, userPreferences: UserPreferences) => {
        setUser(userData);
        setUserPreferences(userPreferences);
    };

  const handleOnboardingComplete = (userPreferences) => {
    // Navigate to home page after onboarding completion
    setUserPreferences(userPreferences);
    window.location.href = '/';
  };

  const handleLogout = () => {
        localStorage.removeItem(STORAGE_USER_KEY);
        localStorage.removeItem(STORAGE_AUTHTOKEN_KEY);
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
                            <RegisteredUserRoute user={user}>
                                <OnboardingWizard 
                                    user={user}
                                    userPreferences={userPreferences}
                                    onLogout={handleLogout}
                                    onComplete={handleOnboardingComplete} 
                                />
                            </RegisteredUserRoute>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute user={user} userPreferences={userPreferences}>
                            <HomePage user={user} onLogout={handleLogout} userPreferences={userPreferences} />
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
