import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import SearchResults from './pages/SearchResults';
import Wishlist from './pages/Wishlist';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Page transition wrapper
function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      {!isAdminRoute && <Header />}
      
      <main className={!isAdminRoute ? 'pt-20' : ''}>
        <PageTransition>
          <Routes location={location}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/order/:id" element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            } />
            <Route path="/wishlist" element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/products" element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            } />
            <Route path="/admin/orders" element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            } />
          </Routes>
        </PageTransition>
      </main>
      
      {!isAdminRoute && <Footer />}
      
      <Toaster 
        position="bottom-right" 
        richColors 
        theme="dark"
        toastOptions={{
          style: {
            background: '#1a1a2e',
            border: '1px solid #27273a',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
