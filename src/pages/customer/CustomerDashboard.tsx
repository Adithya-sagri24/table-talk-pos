import { Routes, Route, Navigate } from 'react-router-dom';
import { useCustomer } from '@/contexts/CustomerContext';
import CustomerAuth from './CustomerAuth';
import CustomerMenu from './CustomerMenu';
import CustomerCart from './CustomerCart';
import CustomerOrders from './CustomerOrders';
import CustomerReservations from './CustomerReservations';
import CustomerFeedback from './CustomerFeedback';

export default function CustomerDashboard() {
  const { isLoggedIn } = useCustomer();

  if (!isLoggedIn) {
    return <CustomerAuth />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/customer/menu" replace />} />
      <Route path="/menu" element={<CustomerMenu />} />
      <Route path="/cart" element={<CustomerCart />} />
      <Route path="/orders" element={<CustomerOrders />} />
      <Route path="/reservations" element={<CustomerReservations />} />
      <Route path="/feedback" element={<CustomerFeedback />} />
    </Routes>
  );
}
