
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { Article, DbArticle } from './types';

// Helper functions for articles
export async function fetchArticles(includeUnpublished: boolean = false): Promise<Article[]> {
  try {
    console.log('Fetching articles from database');
    // Use explicit typing to avoid excessive type instantiation
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching articles:', error);
      toast.error('Failed to load articles');
      return [];
    }
    
    console.log('Articles fetched successfully:', data?.length || 0);
    // Map the database schema to our frontend Article type
    return (data || []).map(article => mapDbArticleToArticle(article));
  } catch (error) {
    console.error('Exception fetching articles:', error);
    toast.error('Failed to load articles');
    return [];
  }
}

export async function fetchArticleById(id: string): Promise<Article | null> {
  try {
    console.log('Fetching article by ID:', id);
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
    
    if (!data) {
      console.log('No article found with ID:', id);
      return null;
    }
    
    console.log('Article fetched successfully:', data);
    // Map the database schema to our frontend Article type
    return mapDbArticleToArticle(data);
  } catch (error) {
    console.error('Exception fetching article:', error);
    toast.error('Failed to load article');
    return null;
  }
}

export async function createOrUpdateArticle(article: Partial<Article>): Promise<Article | null> {
  try {
    // Debug log to track article content
    console.log('Saving article:', article);
    
    if (article.id) {
      // Update existing article
      console.log('Updating existing article with ID:', article.id);
      const { data, error } = await supabase
        .from('articles')
        .update({
          title: article.title_en,
          title_ar: article.title_ar,
          content: article.content_en,
          content_ar: article.content_ar,
          english_text: article.title_en || '', // Required field in the database
          arabic_text: article.title_ar || '', // Required field in the database
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
      
      console.log('Article updated successfully:', data);
      toast.success('Article updated successfully');
      // Return the updated article with our frontend Article type structure
      return mapDbArticleToArticle(data);
    } else {
      // Create new article
      console.log('Creating new article');
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
      
      console.log('Article created successfully:', data);
      toast.success('Article created successfully');
      // Return the created article with our frontend Article type structure
      return mapDbArticleToArticle(data);
    }
  } catch (error) {
    console.error('Exception creating/updating article:', error);
    toast.error('Failed to save article');
    return null;
  }
}

export async function deleteArticle(id: string): Promise<boolean> {
  try {
    console.log('Deleting article with ID:', id);
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting article:', error);
      toast.error('Failed to delete article');
      return false;
    }
    
    console.log('Article deleted successfully');
    toast.success('Article deleted successfully');
    return true;
  } catch (error) {
    console.error('Exception deleting article:', error);
    toast.error('Failed to delete article');
    return false;
  }
}

// Helper function to map database article to our frontend Article type
function mapDbArticleToArticle(dbArticle: any): Article {
  return {
    id: dbArticle.id,
    created_at: dbArticle.created_at || new Date().toISOString(),
    updated_at: dbArticle.updated_at || new Date().toISOString(),
    title_en: dbArticle.title || '',
    title_ar: dbArticle.title_ar || '',
    content_en: dbArticle.content || '',
    content_ar: dbArticle.content_ar || '',
    thumbnail_url: null,
    tags: []
  };
}
