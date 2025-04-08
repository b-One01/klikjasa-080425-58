
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { DataProvider } from "@/contexts/DataContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import ServiceDetail from "./pages/ServiceDetail";
import MyServices from "./pages/MyServices";
import AddService from "./pages/AddService";
import EditService from "./pages/EditService";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/search" element={<Search />} />
              <Route path="/service/:id" element={<ServiceDetail />} />
              <Route path="/my-services" element={<MyServices />} />
              <Route path="/add-service" element={<AddService />} />
              <Route path="/edit-service/:id" element={<EditService />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
