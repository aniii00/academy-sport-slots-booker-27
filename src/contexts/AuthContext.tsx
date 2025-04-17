
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

// Define the User interface
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

// Define profile interface
export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
}

// Define the context type
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<boolean>;
  signup: (email: string, password: string, name: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: Partial<Profile>) => Promise<boolean>;
  isAuthenticated: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Fetch user profile from Supabase
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile if user is authenticated
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    }).finally(() => {
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, remember: boolean): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, phone?: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred during signup');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<Profile>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      // Refresh profile data
      fetchProfile(user.id);
      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('An error occurred while updating your profile');
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const value = {
    user,
    profile,
    session,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
