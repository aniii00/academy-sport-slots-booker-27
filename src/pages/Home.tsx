
import { PageHeader } from "@/components/ui/page-header";
import { SportCard } from "@/components/sport-card";
import { CenterCard } from "@/components/center-card";
import { SmartRecommendations } from "@/components/smart-recommendations";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { sports, centers } from "@/data/mockData";

export default function Home() {
  // Show only the first 4 centers
  const featuredCenters = centers.slice(0, 4);

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="py-12 px-4 md:px-8 rounded-2xl bg-gradient-to-r from-sports-blue to-sports-blue/80 text-white shadow-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Book Your Sports Sessions with Prashant Academy
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Access premium sports facilities across 20+ centers in India. Easy booking, professional coaching.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/centers">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto rounded-xl shadow-md hover:shadow-lg transition-all">
                Find a Center
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Smart Recommendations Section */}
      <section className="rounded-2xl p-6 bg-gradient-to-r from-gray-50 to-white shadow-md">
        <SmartRecommendations />
      </section>

      {/* Sports Section */}
      <section className="rounded-2xl p-6 bg-gradient-to-r from-gray-50 to-white shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Popular Sports</h2>
          <Link to="/centers">
            <Button variant="outline" className="rounded-xl shadow-sm hover:shadow-md transition-all">View All</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {sports.map((sport) => (
            <SportCard key={sport.id} sport={sport} />
          ))}
        </div>
      </section>

      {/* Centers Section */}
      <section className="rounded-2xl p-6 bg-gradient-to-r from-gray-50 to-white shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Centers</h2>
          <Link to="/centers">
            <Button variant="outline" className="rounded-xl shadow-sm hover:shadow-md transition-all">View All Centers</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCenters.map((center) => (
            <CenterCard key={center.id} center={center} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="rounded-2xl p-8 bg-gradient-to-r from-sports-blue/10 to-sports-blue/5 shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-sports-blue to-sports-blue/80 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 shadow-md">1</div>
            <h3 className="text-lg font-semibold mb-2">Choose a Sport</h3>
            <p className="text-gray-600">Select from our wide range of sports activities available across all centers.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-sports-blue to-sports-blue/80 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 shadow-md">2</div>
            <h3 className="text-lg font-semibold mb-2">Find a Slot</h3>
            <p className="text-gray-600">Browse available time slots that match your schedule at your preferred center.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-sports-blue to-sports-blue/80 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 shadow-md">3</div>
            <h3 className="text-lg font-semibold mb-2">Book & Play</h3>
            <p className="text-gray-600">Book your slot, make the payment, and you're all set to enjoy your session.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
