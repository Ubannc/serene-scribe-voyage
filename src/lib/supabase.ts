
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

// Define a type for articles based on the generated Supabase types
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
    
    // Map the database schema to our frontend Article type
    return (data || []).map(article => ({
      id: article.id,
      created_at: article.created_at || new Date().toISOString(),
      updated_at: article.updated_at || new Date().toISOString(),
      title_en: article.title || '',
      title_ar: article.title_ar || '',
      content_en: article.content || '',
      content_ar: article.content_ar || '',
      published: true, // Default to published for existing articles
      published_at: article.created_at || new Date().toISOString(),
      thumbnail_url: null,
      tags: []
    }));
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
    
    if (!data) return null;
    
    // Map the database schema to our frontend Article type
    return {
      id: data.id,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString(),
      title_en: data.title || '',
      title_ar: data.title_ar || '',
      content_en: data.content || '',
      content_ar: data.content_ar || '',
      published: true, // Default to published for existing articles
      published_at: data.created_at || new Date().toISOString(),
      thumbnail_url: null,
      tags: []
    };
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
          title: article.title_en,
          title_ar: article.title_ar,
          content: article.content_en,
          content_ar: article.content_ar,
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
      // Return the updated article with our frontend Article type structure
      return {
        id: data.id,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
        title_en: data.title || '',
        title_ar: data.title_ar || '',
        content_en: data.content || '',
        content_ar: data.content_ar || '',
        published: true,
        published_at: data.created_at || new Date().toISOString(),
        thumbnail_url: null,
        tags: []
      };
    } else {
      // Create new article
      const { data, error } = await supabase
        .from('articles')
        .insert([
          {
            title: article.title_en || '',
            title_ar: article.title_ar || '',
            content: article.content_en || '',
            content_ar: article.content_ar || '',
            english_text: article.title_en || '', // Required field in the database
            arabic_text: article.title_ar || '', // Required field in the database
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
      // Return the created article with our frontend Article type structure
      return {
        id: data.id,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
        title_en: data.title || '',
        title_ar: data.title_ar || '',
        content_en: data.content || '',
        content_ar: data.content_ar || '',
        published: true,
        published_at: data.created_at || new Date().toISOString(),
        thumbnail_url: null,
        tags: []
      };
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
