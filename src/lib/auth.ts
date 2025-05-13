
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

// This function is kept for backward compatibility but is no longer needed
// It will always return false, as we've moved to Supabase authentication
export async function verifyAdminToken(token: string): Promise<boolean> {
  console.log('Token-based auth is deprecated, using Supabase authentication instead');
  return false;
}

// Helper function to get the current user
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// Helper function to check if a user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}
