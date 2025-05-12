
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/sonner';

// Types for our database tables
export type Article = {
  id: string;
  created_at: string;
  updated_at: string;
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
  published: boolean;
  published_at: string | null;
  thumbnail_url: string | null;
  tags: string[] | null;
};

// Initialize Supabase client with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions
export async function fetchArticles(onlyPublished = true): Promise<Article[]> {
  try {
    let query = supabase.from('articles').select('*');
    
    if (onlyPublished) {
      query = query.eq('published', true);
    }
    
    const { data, error } = await query.order('published_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching articles:', error);
      toast.error('Failed to load articles');
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception fetching articles:', error);
    toast.error('Failed to load articles');
    return [];
  }
}

export async function fetchArticleById(id: string): Promise<Article | null> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching article:', error);
      toast.error('Failed to load article');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception fetching article:', error);
    toast.error('Failed to load article');
    return null;
  }
}

export async function createOrUpdateArticle(article: Partial<Article>): Promise<Article | null> {
  try {
    if (article.id) {
      // Update existing article
      const { data, error } = await supabase
        .from('articles')
        .update({
          title_en: article.title_en,
          title_ar: article.title_ar,
          content_en: article.content_en,
          content_ar: article.content_ar,
          published: article.published,
          published_at: article.published ? new Date().toISOString() : article.published_at,
          thumbnail_url: article.thumbnail_url,
          tags: article.tags,
          updated_at: new Date().toISOString(),
        })
        .eq('id', article.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating article:', error);
        toast.error('Failed to update article');
        return null;
      }
      
      toast.success('Article updated successfully');
      return data;
    } else {
      // Create new article
      const { data, error } = await supabase
        .from('articles')
        .insert([
          {
            title_en: article.title_en || '',
            title_ar: article.title_ar || '',
            content_en: article.content_en || '',
            content_ar: article.content_ar || '',
            published: article.published || false,
            published_at: article.published ? new Date().toISOString() : null,
            thumbnail_url: article.thumbnail_url || null,
            tags: article.tags || [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating article:', error);
        toast.error('Failed to create article');
        return null;
      }
      
      toast.success('Article created successfully');
      return data;
    }
  } catch (error) {
    console.error('Exception creating/updating article:', error);
    toast.error('Failed to save article');
    return null;
  }
}

export async function deleteArticle(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting article:', error);
      toast.error('Failed to delete article');
      return false;
    }
    
    toast.success('Article deleted successfully');
    return true;
  } catch (error) {
    console.error('Exception deleting article:', error);
    toast.error('Failed to delete article');
    return false;
  }
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  // In a real implementation, this would verify against a secure token in Supabase
  // For this demo, we'll use the hardcoded token from the requirements
  const validToken = '85JpSoF5cc030g9e8GeC';
  return token === validToken;
}

export async function uploadImage(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `thumbnails/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      toast.error('Failed to upload image');
      return null;
    }

    const { data } = supabase.storage.from('media').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error('Exception uploading image:', error);
    toast.error('Failed to upload image');
    return null;
  }
}
