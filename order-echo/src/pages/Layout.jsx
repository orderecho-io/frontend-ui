
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";

export default function Layout({ children }) {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();
    
    console.log('Layout render - loading:', loading, 'isAuthenticated:', isAuthenticated, 'pathname:', location.pathname);
    
    // Define which pages should show the sidebar (authenticated pages)
    const authenticatedPages = ['/dashboard', '/orders', '/menufiles', '/profile', '/settings', '/admin'];
    const shouldShowSidebar = isAuthenticated && authenticatedPages.includes(location.pathname);
    
    console.log('Layout - shouldShowSidebar:', shouldShowSidebar);
    
    // Show loading state while checking authentication
    if (loading) {
        console.log('Layout - showing loading state');
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }
    
    if (shouldShowSidebar) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden ml-64">
                    <Header />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto pt-16">
                        {children}
                    </main>
                </div>
            </div>
        );
    }
    
    // For landing page and other public pages, use original layout
    return (
        <div>
            <Header />
            <main className="pt-16">
                {children}
            </main>
        </div>
    );
}
