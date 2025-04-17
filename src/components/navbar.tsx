
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  HomeIcon, 
  ListIcon, 
  CalendarIcon, 
  LoginIcon, 
  SettingsIcon,
  UserIcon,
  LogOutIcon,
  UserPlusIcon
} from "@/utils/iconMapping";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const { user, profile, isAuthenticated, logout } = useAuth();
  
  // Debug the user role
  console.log("Navbar - profile:", profile);
  console.log("Navbar - user role:", profile?.role);
  
  // Check if the user is an admin - must be exactly 'admin' string
  const isAdmin = profile?.role === 'admin';
  
  // Function to get user initials for avatar
  const getUserInitials = () => {
    if (!profile?.name) return "U";
    return profile.name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b">
      <div className="container px-4 mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-sports-blue">Prashant Academy</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-gray-600 hover:text-sports-blue">Home</Link>
            <Link to="/centers" className="text-gray-600 hover:text-sports-blue">Centers</Link>
            <Link to="/slots" className="text-gray-600 hover:text-sports-blue">Slots</Link>
            {isAuthenticated && isAdmin && (
              <Link to="/admin" className="text-gray-600 hover:text-sports-blue">Admin</Link>
            )}
          </nav>
          
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 bg-sports-blue text-white">
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{profile?.name || "User Account"}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/profile" className="flex w-full items-center">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/profile?tab=bookings" className="flex w-full items-center">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>My Bookings</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem>
                      <Link to="/admin" className="flex w-full items-center">
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost">
                    <LoginIcon className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-sports-blue hover:bg-sports-blue/90">
                    <UserPlusIcon className="mr-2 h-4 w-4" />
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
            
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="md:hidden">
                  <ListIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="py-4">
                  <h2 className="text-lg font-semibold mb-4">Menu</h2>
                  <div className="flex flex-col gap-2">
                    <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100">
                      <HomeIcon className="h-5 w-5" />
                      <span>Home</span>
                    </Link>
                    <Link to="/centers" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100">
                      <CalendarIcon className="h-5 w-5" />
                      <span>Find Centers</span>
                    </Link>
                    <Link to="/slots" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100">
                      <CalendarIcon className="h-5 w-5" />
                      <span>Slots</span>
                    </Link>
                    
                    {isAuthenticated ? (
                      <>
                        <Link to="/profile" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100">
                          <UserIcon className="h-5 w-5" />
                          <span>My Profile</span>
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100">
                            <SettingsIcon className="h-5 w-5" />
                            <span>Admin Panel</span>
                          </Link>
                        )}
                        <Button
                          variant="ghost"
                          onClick={logout}
                          className="flex items-center justify-start gap-2 px-4 py-2 h-auto font-normal"
                        >
                          <LogOutIcon className="h-5 w-5" />
                          <span>Logout</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100">
                          <LoginIcon className="h-5 w-5" />
                          <span>Login</span>
                        </Link>
                        <Link to="/signup" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100">
                          <UserPlusIcon className="h-5 w-5" />
                          <span>Sign Up</span>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
