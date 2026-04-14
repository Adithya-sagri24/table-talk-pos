import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoleProvider } from "@/contexts/RoleContext";
import { CustomerProvider } from "@/contexts/CustomerContext";
import { AppLayout } from "@/components/AppLayout";
import LandingPage from "./pages/LandingPage";
import StaffLogin from "./pages/StaffLogin";
import WaiterDashboard from "./pages/WaiterDashboard";
import ChefDashboard from "./pages/ChefDashboard";
import BillingDashboard from "./pages/BillingDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RoleProvider>
          <CustomerProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<StaffLogin />} />

              {/* Dashboard routes with sidebar layout */}
              <Route path="/waiter" element={<AppLayout><WaiterDashboard /></AppLayout>} />
              <Route path="/waiter/orders" element={<AppLayout><WaiterDashboard /></AppLayout>} />
              <Route path="/chef" element={<AppLayout><ChefDashboard /></AppLayout>} />
              <Route path="/billing" element={<AppLayout><BillingDashboard /></AppLayout>} />
              <Route path="/manager" element={<AppLayout><ManagerDashboard /></AppLayout>} />
              <Route path="/manager/*" element={<AppLayout><ManagerDashboard /></AppLayout>} />
              <Route path="/admin" element={<AppLayout><AdminDashboard /></AppLayout>} />
              <Route path="/admin/*" element={<AppLayout><AdminDashboard /></AppLayout>} />
              <Route path="/customer/*" element={<CustomerDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CustomerProvider>
        </RoleProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
