
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/protected-route";
import Home from "./pages/Home";
import Centers from "./pages/Centers";
import Slots from "./pages/Slots";
import Booking from "./pages/Booking";
import BookingSuccess from "./pages/BookingSuccess";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

// Create a query client with mobile-optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Better for mobile experience
      retry: 1, // Reduce retries on mobile to save data
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-center" /> {/* More mobile-friendly position */}
          <Routes>
            {/* Authentication routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Main app routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/centers" element={<Centers />} />
              <Route path="/slots" element={<Slots />} />
              <Route path="/booking" element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              } />
              <Route path="/booking-success" element={
                <ProtectedRoute>
                  <BookingSuccess />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
