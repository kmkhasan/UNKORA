import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, User, Heart, ShoppingCart, Menu, X, ChevronDown, LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { categoriesAPI } from '../api/apiService';
import type { Category } from '../data/mockDatabase';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Books', href: '/category/fiction' },
  { name: 'Baby Products', href: '/category/baby' },
  { name: 'Leather Goods', href: '/category/leather' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategories, setShowCategories] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();
  const { items, totalItems, subtotal } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      const cats = await categoriesAPI.getAll();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-[#0f0f23]/90 backdrop-blur-xl border-b border-white/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-10 h-10 bg-gradient-to-br from-[#6366f1] to-[#ec4899] rounded-xl flex items-center justify-center"
            >
              <span className="text-white font-bold text-xl">B</span>
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              BookStore
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Link
                  to={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#6366f1] to-[#ec4899] group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
            
            {/* Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors">
                Categories
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <AnimatePresence>
                {showCategories && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-[#1a1a2e]/95 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden shadow-2xl"
                  >
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                        onClick={() => setShowCategories(false)}
                      >
                        <img src={cat.image} alt={cat.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-medium text-white">{cat.name}</p>
                          <p className="text-xs text-white/50">{cat.productCount} products</p>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <AnimatePresence>
              {isSearchOpen ? (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 280, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onSubmit={handleSearch}
                  className="hidden md:flex items-center overflow-hidden"
                >
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                    <Search className="w-4 h-4 text-white/50" />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-0 bg-transparent focus-visible:ring-0 text-sm w-full text-white placeholder:text-white/50"
                      autoFocus
                    />
                    <button type="button" onClick={() => setIsSearchOpen(false)}>
                      <X className="w-4 h-4 text-white/50 hover:text-white" />
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSearchOpen(true)}
                  className="hidden md:flex p-2.5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Search className="w-5 h-5 text-white/70" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Wishlist */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/wishlist')}
              className="hidden sm:flex p-2.5 hover:bg-white/10 rounded-full transition-colors relative"
            >
              <Heart className="w-5 h-5 text-white/70" />
            </motion.button>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative group">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 p-1.5 pr-3 hover:bg-white/10 rounded-full transition-colors"
                >
                  <img 
                    src={user?.avatar} 
                    alt={user?.firstName} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="hidden lg:block text-sm text-white/70">{user?.firstName}</span>
                </motion.button>
                
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a1a2e]/95 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Profile</span>
                  </Link>
                  <Link to="/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm">My Orders</span>
                  </Link>
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6366f1] to-[#ec4899] rounded-full text-sm font-medium"
              >
                <User className="w-4 h-4" />
                Sign In
              </motion.button>
            )}

            {/* Cart */}
            <Sheet>
              <SheetTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 hover:bg-white/10 rounded-full transition-colors relative"
                >
                  <ShoppingCart className="w-5 h-5 text-white/70" />
                  {totalItems > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#6366f1] to-[#ec4899] text-white text-xs rounded-full flex items-center justify-center font-bold"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </motion.button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md bg-[#1a1a2e] border-l border-white/10">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-white">
                    <ShoppingCart className="w-5 h-5" />
                    Shopping Cart ({totalItems})
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  {items.length === 0 ? (
                    <div className="text-center py-12">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4"
                      >
                        <ShoppingCart className="w-10 h-10 text-white/30" />
                      </motion.div>
                      <p className="text-white/50">Your cart is empty</p>
                      <p className="text-sm text-white/30 mt-1">Add some items to get started</p>
                      <Button 
                        onClick={() => navigate('/')} 
                        className="mt-6 bg-gradient-to-r from-[#6366f1] to-[#ec4899]"
                      >
                        Continue Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <motion.div 
                          key={item.id} 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-4 bg-white/5 p-4 rounded-xl"
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-20 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm line-clamp-2 text-white">{item.product.name}</h4>
                            {item.variant && (
                              <p className="text-xs text-white/50 mt-1">{item.variant.name}</p>
                            )}
                            <p className="text-[#ec4899] font-semibold mt-1">
                              ${(item.variant?.price || item.product.price).toFixed(2)}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm text-white/70">Qty: {item.quantity}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      <div className="border-t border-white/10 pt-4 mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/70">Subtotal</span>
                          <span className="text-white">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-white font-semibold">Total</span>
                          <span className="text-xl font-bold bg-gradient-to-r from-[#6366f1] to-[#ec4899] bg-clip-text text-transparent">
                            ${(subtotal + (subtotal > 50 ? 0 : 9.99)).toFixed(2)}
                          </span>
                        </div>
                        <Button 
                          onClick={() => navigate('/checkout')} 
                          className="w-full bg-gradient-to-r from-[#6366f1] to-[#ec4899] hover:opacity-90"
                        >
                          Checkout
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden p-2.5 hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-white/70" />
              ) : (
                <Menu className="w-5 h-5 text-white/70" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0f0f23]/95 backdrop-blur-xl border-t border-white/10"
          >
            <nav className="flex flex-col p-6 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-white/70 hover:text-white transition-colors py-3 border-b border-white/5"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4">
                <p className="text-sm text-white/50 mb-3">Categories</p>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-2 text-white/70 hover:text-white transition-colors"
                  >
                    <img src={cat.image} alt={cat.name} className="w-8 h-8 rounded-lg object-cover" />
                    {cat.name}
                  </Link>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
