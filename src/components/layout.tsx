
import { Outlet, useLocation, Link } from "react-router-dom";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { HomeIcon, GridIcon, CalendarIcon, UserIcon } from "@/utils/iconMapping";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

export function Layout() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Check which tab is active based on the current path
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!isMobile && <Navbar />}
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-4">
          <Outlet />
        </div>
      </main>
      
      {!isMobile && <Footer />}
      
      {/* Mobile Bottom Navigation - Android style */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="flex justify-around items-center h-16">
            <Link 
              to="/" 
              className={`flex flex-col items-center justify-center flex-1 py-2 ${
                isActive('/') ? 'text-sports-blue' : 'text-gray-500'
              }`}
            >
              <HomeIcon className="h-6 w-6" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            
            <Link 
              to="/centers" 
              className={`flex flex-col items-center justify-center flex-1 py-2 ${
                isActive('/centers') ? 'text-sports-blue' : 'text-gray-500'
              }`}
            >
              <GridIcon className="h-6 w-6" />
              <span className="text-xs mt-1">Centers</span>
            </Link>
            
            <Link 
              to="/slots" 
              className={`flex flex-col items-center justify-center flex-1 py-2 ${
                isActive('/slots') ? 'text-sports-blue' : 'text-gray-500'
              }`}
            >
              <CalendarIcon className="h-6 w-6" />
              <span className="text-xs mt-1">Slots</span>
            </Link>
            
            <Link 
              to={isAuthenticated ? "/profile" : "/login"} 
              className={`flex flex-col items-center justify-center flex-1 py-2 ${
                isActive('/profile') || isActive('/login') ? 'text-sports-blue' : 'text-gray-500'
              }`}
            >
              <UserIcon className="h-6 w-6" />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
