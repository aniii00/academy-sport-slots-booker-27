
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserIcon, LogOutIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Booking {
  id: string;
  created_at: string;
  user_id: string;
  center_name: string;
  sport_type: string;
  slot_time: string;
  status: string;
}

export default function Profile() {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching bookings for user ID:", user?.id);
      
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user?.id)
        .order("slot_time", { ascending: false });

      if (error) {
        console.error("Error fetching bookings:", error);
        toast({
          title: "Error fetching bookings",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log("Bookings fetched:", data);
      setBookings(data || []);
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error fetching bookings",
        description: error.message || "Could not fetch bookings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <PageHeader 
        title="Profile" 
        action={
          <Button variant="outline" onClick={handleSignOut}>
            <LogOutIcon className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        }
      />
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback>
                  <UserIcon className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{profile?.first_name} {profile?.last_name}</CardTitle>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-4">Loading your bookings...</p>
            ) : bookings.length === 0 ? (
              <p className="text-muted-foreground">No bookings found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Center</TableHead>
                    <TableHead>Sport</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.center_name}</TableCell>
                      <TableCell>{booking.sport_type}</TableCell>
                      <TableCell>{formatDateTime(booking.slot_time)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                onClick={fetchBookings}
                className="mt-2"
              >
                Refresh Bookings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
