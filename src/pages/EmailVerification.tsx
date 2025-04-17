
import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, AlertCircle, Home, ArrowLeft } from "lucide-react";

export default function EmailVerification() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  useEffect(() => {
    console.log("EmailVerification component mounted");
    console.log("Current session:", session);
    console.log("Email from location state:", email);
    
    // If user is already authenticated (email verified), redirect to home
    if (session?.user?.email_confirmed_at) {
      console.log("Email already confirmed, redirecting to home");
      navigate("/");
    }
  }, [session, navigate, email]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sports-lightBlue to-white p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 bg-sports-blue/10 rounded-full flex items-center justify-center">
              <Mail className="h-10 w-10 text-sports-blue" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Check Your Email</CardTitle>
          <CardDescription className="text-center">
            We've sent a verification link to
            {email && <span className="font-medium block mt-1">{email}</span>}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-800">
              You need to verify your email address before you can access your account.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2 text-sm">
            <p className="font-medium">What happens next?</p>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>Check your email inbox for a message from us</li>
              <li>Click the verification link in the email</li>
              <li>Once verified, you can log in to your account</li>
            </ol>
          </div>
          
          <div className="text-sm text-gray-600 mt-4">
            <p>Didn't receive an email? Check your spam folder or try signing up again with a different email address.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Link to="/login" className="w-full">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </Link>
          <Link to="/" className="w-full">
            <Button variant="ghost" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
