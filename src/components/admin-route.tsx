
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
  console.log("AdminRoute - isLoading:", isLoading);
  
  // Show loading state while checking authentication or if profile isn't loaded yet
  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sports-blue"></div>
      </div>
    );
  }

  // Once profile is loaded, check if role is admin
  if (profile.role !== 'admin') {
    // Show a toast message when access is denied
    toast.error("You don't have admin access");
    // Redirect to home if not an admin
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
