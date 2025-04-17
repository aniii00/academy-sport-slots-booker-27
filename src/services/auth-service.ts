
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/components/ui/sonner';
import { Profile } from "@/types/auth";

export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

export const loginUser = async (email: string, password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      toast.error(error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Login error:', error);
    toast.error('An error occurred during login');
    return false;
  }
};

export const signupUser = async (
  email: string, 
  password: string, 
  name: string, 
  phone?: string
): Promise<boolean> => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone
        }
      }
    });
    
    if (authError) {
      toast.error(authError.message);
      return false;
    }

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email,
          first_name: name.split(' ')[0],
          last_name: name.split(' ').slice(1).join(' '),
          role: 'user',
          created_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        toast.error('Account created but profile setup failed');
        return false;
      }
    }

    toast.success('Account created successfully! Please check your email for verification.');
    return true;
  } catch (error) {
    console.error('Signup error:', error);
    toast.error('An error occurred during signup');
    return false;
  }
};

export const updateUserProfile = async (userId: string, profileData: Partial<Profile>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId);
    
    if (error) {
      toast.error(error.message);
      return false;
    }
    
    toast.success('Profile updated successfully!');
    return true;
  } catch (error) {
    console.error('Update profile error:', error);
    toast.error('An error occurred while updating your profile');
    return false;
  }
};
