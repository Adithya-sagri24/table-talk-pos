import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoleProvider } from "@/contexts/RoleContext";
import { CustomerProvider } from "@/contexts/CustomerContext";
import { AppLayout } from "@/components/AppLayout";
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
            <AppLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/manager" replace />} />
                <Route path="/waiter" element={<WaiterDashboard />} />
                <Route path="/waiter/orders" element={<WaiterDashboard />} />
                <Route path="/chef" element={<ChefDashboard />} />
                <Route path="/billing" element={<BillingDashboard />} />
                <Route path="/manager" element={<ManagerDashboard />} />
                <Route path="/manager/*" element={<ManagerDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
                <Route path="/customer/*" element={<CustomerDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </CustomerProvider>
        </RoleProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
