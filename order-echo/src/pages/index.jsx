import Layout from "./Layout.jsx";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Dashboard from "./Dashboard";
import MenuFiles from "./MenuFiles";
import Orders from "./Orders";
import Profile from "./Profile";
import AdminDashboard from "./AdminDashboard";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import SuperAdminRoute from "../components/auth/SuperAdminRoute";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                <Route path="/" element={<Home />} />
                <Route path="/Home" element={<Home />} />
                
                {/* Authentication Routes */}
                <Route 
                    path="/login" 
                    element={
                        <ProtectedRoute requireAuth={false}>
                            <Login />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/signup" 
                    element={
                        <ProtectedRoute requireAuth={false}>
                            <Signup />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/forgot-password" 
                    element={
                        <ProtectedRoute requireAuth={false}>
                            <ForgotPassword />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/reset-password" 
                    element={
                        <ProtectedRoute requireAuth={false}>
                            <ResetPassword />
                        </ProtectedRoute>
                    } 
                />
                
                {/* Protected Routes */}
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute requireAuth={true}>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/menufiles" 
                    element={
                        <ProtectedRoute requireAuth={true}>
                            <MenuFiles />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/orders" 
                    element={
                        <ProtectedRoute requireAuth={true}>
                            <Orders />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/profile" 
                    element={
                        <ProtectedRoute requireAuth={true}>
                            <Profile />
                        </ProtectedRoute>
                    } 
                />
                
                {/* Super Admin Routes */}
                <Route 
                    path="/admin" 
                    element={
                        <ProtectedRoute requireAuth={true}>
                            <SuperAdminRoute>
                                <AdminDashboard />
                            </SuperAdminRoute>
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}