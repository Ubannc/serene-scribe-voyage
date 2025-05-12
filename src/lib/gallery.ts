
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { GalleryItem } from './types';

// Gallery functions
export async function fetchGalleryItems(): Promise<GalleryItem[]> {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching gallery items:', error);
      toast.error('Failed to load gallery');
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exception fetching gallery:', error);
    toast.error('Failed to load gallery');
    return [];
  }
}

export async function createGalleryItem(title: string, url: string): Promise<GalleryItem | null> {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .insert([{ title, url, date: new Date().toISOString() }])
      .select()
      .single();

    if (error) {
      console.error('Error creating gallery item:', error);
      toast.error('Failed to add gallery item');
      return null;
    }

    toast.success('Gallery item added successfully');
    return data;
  } catch (error) {
    console.error('Exception creating gallery item:', error);
    toast.error('Failed to add gallery item');
    return null;
  }
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting gallery item:', error);
      toast.error('Failed to delete gallery item');
      return false;
    }

    toast.success('Gallery item deleted successfully');
    return true;
  } catch (error) {
    console.error('Exception deleting gallery item:', error);
    toast.error('Failed to delete gallery item');
    return false;
  }
}
