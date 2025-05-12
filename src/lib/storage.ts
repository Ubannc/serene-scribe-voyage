
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

export async function uploadImage(file: File, bucket: string = 'media'): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = bucket === 'gallery' ? `${fileName}` : `thumbnails/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      toast.error('Failed to upload image');
      return null;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error('Exception uploading image:', error);
    toast.error('Failed to upload image');
    return null;
  }
}
