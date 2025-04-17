
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { profile, isLoading } = useAuth();
  const location = useLocation();
  
  // Debug the profile data to see what's happening
  console.log("AdminRoute - profile:", profile);
  console.log("AdminRoute - role:", profile?.role);
  console.log("AdminRoute - isAdmin check:", profile?.role === 'admin');
  
  // Check if the user's role is strictly 'admin' (case-sensitive string comparison)
  const isAdmin = profile?.role === 'admin';

  if (isLoading) {
    // Show loading state while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sports-blue"></div>
      </div>
    );
  }

  // If profile exists but role is not strictly 'admin', deny access
  if (!isAdmin) {
    // Show a toast message when access is denied
    toast.error("You don't have admin access");
    // Redirect to home if not an admin
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
