import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";
import TechnologyPage from "./pages/TechnologyPage.tsx";
import MastTypePage from "./pages/MastTypePage.tsx";
import ProductVariantsPage from "./pages/ProductVariantsPage.tsx";
import SelectorPage from "./pages/SelectorPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminProducts from "./pages/admin/AdminProducts.tsx";
import AdminPricing from "./pages/admin/AdminPricing.tsx";
import AdminQuotes from "./pages/admin/AdminQuotes.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/category/:category" element={<CategoryPage />} />
                <Route path="/category/:category/t/:technology" element={<TechnologyPage />} />
                <Route path="/category/:category/t/:technology/:mastType" element={<MastTypePage />} />
                <Route path="/category/:category/t/:technology/:mastType/:duty" element={<ProductVariantsPage />} />
                <Route path="/category/:category/:sub" element={<ProductVariantsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="pricing" element={<AdminPricing />} />
                  <Route path="quotes" element={<AdminQuotes />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
