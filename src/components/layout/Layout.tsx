
import { ReactNode, useEffect, useState } from "react";
import Navigation from "./Navigation";

interface LayoutProps {
  children: ReactNode;
  hideNavigation?: boolean;
}

const Layout = ({ children, hideNavigation = false }: LayoutProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check authentication status whenever the layout renders
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated") === "true";
      setIsAuthenticated(authStatus);
    };
    
    checkAuth();
    
    // Listen for storage changes (for when login/logout happens in another tab)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {!hideNavigation && <Navigation />}
      <main className="flex-1 pt-16 md:pt-20 pb-16 md:pb-0">
        {children}
      </main>
    </div>
  );
};

export default Layout;
