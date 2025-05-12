
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { motion, AnimatePresence } from "framer-motion";

// Pages
import Index from "./pages/Index";
import ArticlePage from "./pages/ArticlePage";
import AdminDashboard from "./pages/AdminDashboard";
import ArticleEditor from "./pages/ArticleEditor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/article/:id" element={<ArticlePage />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/new"
                  element={
                    <ProtectedRoute>
                      <ArticleEditor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/edit/:id"
                  element={
                    <ProtectedRoute>
                      <ArticleEditor />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
