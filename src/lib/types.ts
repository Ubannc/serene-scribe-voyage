
// Common types for the application

// Define a type for articles with explicit types to avoid excessive type instantiation
export type Article = {
  id: string;
  created_at: string;
  updated_at: string;
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
  thumbnail_url: string | null;
  tags: string[] | null;
};

// Define a type for database article to match Supabase schema
export type DbArticle = {
  id: string;
  created_at: string | null;
  updated_at: string | null;
  title: string;
  title_ar: string | null;
  content: string;
  content_ar: string | null;
  english_text: string;
  arabic_text: string;
};

// Define a type for gallery items
export type GalleryItem = {
  id: string;
  title: string;
  url: string;
  date: string | null;
};
