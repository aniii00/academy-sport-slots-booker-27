
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  TimeIcon, 
  PriceIcon, 
  LocationIcon, 
  UserIcon, 
  PhoneIcon 
} from "@/utils/iconMapping";
import { 
  centers, 
  sports, 
  generateTimeSlots, 
  TimeSlot 
} from "@/data/mockData";
import { toast } from "@/components/ui/sonner";

// Add Razorpay type
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const slotId = searchParams.get('slotId');
  
  const [slot, setSlot] = useState<TimeSlot | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingScript, setLoadingScript] = useState(false);
  
  // Use profile data if available
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);
  
  // Find slot based on ID from URL
  useEffect(() => {
    if (slotId) {
      const allSlots = generateTimeSlots();
      const foundSlot = allSlots.find(s => s.id === slotId);
      if (foundSlot && foundSlot.available) {
        setSlot(foundSlot);
      } else {
        // If slot doesn't exist or is not available, redirect to slots page
        toast.error("This slot is not available for booking");
        navigate("/slots");
      }
    } else {
      navigate("/slots");
    }
  }, [slotId, navigate]);
  
  // Load Razorpay script
  useEffect(() => {
    if (!window.Razorpay && !loadingScript) {
      setLoadingScript(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        setLoadingScript(false);
      };
      document.body.appendChild(script);
    }
  }, [loadingScript]);
  
  // Get the center and sport for the selected slot
  const center = slot ? centers.find(c => c.id === slot.centerId) : null;
  const sport = slot ? sports.find(s => s.id === slot.sportId) : null;
  
  const initiatePayment = async () => {
    if (!user || !slot || !center || !sport) {
      toast.error("Missing booking information");
      return;
    }
    
    try {
      // Create order on the server
      const response = await supabase.functions.invoke('razorpay', {
        body: {
          action: 'create_order',
          amount: slot.price,
          receipt: `booking-${Date.now()}`,
          name,
          email: user.email,
          contact: phone
        },
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to create order");
      }
      
      const { order, key_id } = response.data;
      
      // Initialize Razorpay
      const razorpay = new window.Razorpay({
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Prashant Academy",
        description: `Booking for ${sport.name} at ${center.name}`,
        image: "https://example.com/your_logo.png",
        handler: async function(response: any) {
          await onPaymentSuccess(order.id, response);
        },
        prefill: {
          name,
          email: user.email,
          contact: phone
        },
        theme: {
          color: "#3399cc"
        }
      });
      
      razorpay.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error("Failed to initiate payment. Please try again.");
      setIsSubmitting(false);
    }
  };
  
  const onPaymentSuccess = async (orderId: string, response: any) => {
    try {
      // Verify payment with server
      const verifyResponse = await supabase.functions.invoke('razorpay', {
        body: {
          action: 'verify_payment',
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        },
      });
      
      if (!verifyResponse.data.success || !verifyResponse.data.valid) {
        throw new Error("Payment verification failed");
      }
      
      // Save booking to database
      if (slot && center && sport && user) {
        const { error } = await supabase.from('bookings').insert({
          user_id: user.id,
          center_name: center.name,
          sport_type: sport.name,
          start_time: slot.startTime,
          end_time: slot.endTime,
          booking_date: slot.date,
          amount: slot.price,
          status: 'confirmed'
        });
        
        if (error) throw error;
      }
      
      toast.success("Booking confirmed! You'll receive details on your phone.");
      navigate("/booking-success");
    } catch (error) {
      console.error("Payment verification error:", error);
      toast.error("Payment verification failed. Please contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setIsSubmitting(true);
    initiatePayment();
  };
  
  if (!slot || !center || !sport) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">Loading booking details...</h3>
      </div>
    );
  }
  
  const formattedDate = format(new Date(slot.date), "EEEE, MMMM d, yyyy");
  
  return (
    <div>
      <PageHeader 
        title="Complete Your Booking" 
        subtitle="Enter your details to confirm the reservation"
        showBackButton
        backTo={`/slots?centerId=${center.id}&sportId=${sport.id}`}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Booking summary */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Sport</h4>
                <p className="text-lg">{sport.name}</p>
              </div>
              
              <div>
                <h4 className="font-medium">Center</h4>
                <div className="flex items-start">
                  <LocationIcon className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
                  <div>
                    <p className="text-lg">{center.name}</p>
                    <p className="text-gray-500">{center.address}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Date & Time</h4>
                <div className="flex items-center">
                  <TimeIcon className="h-5 w-5 mr-2 text-gray-500" />
                  <p>{formattedDate}, {slot.startTime} - {slot.endTime}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Total Amount</h4>
                  <div className="flex items-center text-xl font-bold text-sports-orange">
                    <PriceIcon className="h-5 w-5 mr-1" />
                    <span>₹{slot.price}</span>
                    {slot.price === 1 && (
                      <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Test Payment</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Booking form */}
        <Card>
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="name" 
                      placeholder="Enter your full name" 
                      className="pl-10" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="phone" 
                      placeholder="Enter your phone number" 
                      className="pl-10" 
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      maxLength={10}
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end pt-4 border-t">
              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={isSubmitting || loadingScript}
              >
                {isSubmitting ? "Processing..." : loadingScript ? "Loading Payment..." : `Pay ₹${slot.price}`}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
