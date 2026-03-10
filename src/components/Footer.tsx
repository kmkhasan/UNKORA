import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin,
  CreditCard, Truck, RotateCcw, Shield, Headphones
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const footerLinks = {
  shop: [
    { name: 'Books', href: '/category/fiction' },
    { name: 'Baby Products', href: '/category/baby' },
    { name: 'Leather Goods', href: '/category/leather' },
    { name: 'New Arrivals', href: '/search?sort=newest' },
    { name: 'Best Sellers', href: '/search?sort=rating' },
  ],
  support: [
    { name: 'Contact Us', href: '#' },
    { name: 'FAQs', href: '#' },
    { name: 'Shipping Info', href: '#' },
    { name: 'Returns', href: '#' },
    { name: 'Track Order', href: '/orders' },
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Blog', href: '#' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'Youtube' },
];

const features = [
  { icon: Truck, title: 'Free Shipping', description: 'On orders over $50' },
  { icon: RotateCcw, title: 'Easy Returns', description: '30-day return policy' },
  { icon: Shield, title: 'Secure Payment', description: '100% secure checkout' },
  { icon: Headphones, title: '24/7 Support', description: 'Always here to help' },
];

export default function Footer() {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you for subscribing!');
  };

  return (
    <footer className="bg-[#0a0a18] border-t border-white/5">
      {/* Features */}
      <div className="border-b border-white/5">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-[#6366f1]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-[#6366f1]" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{feature.title}</p>
                    <p className="text-sm text-white/50">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-b border-white/5">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-white/50">Get the latest updates on new arrivals and exclusive offers.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3 w-full md:w-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-[#1a1a2e] border-white/10 w-full md:w-80"
              />
              <Button type="submit" className="bg-gradient-to-r from-[#6366f1] to-[#ec4899]">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#6366f1] to-[#ec4899] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-xl font-bold">BookStore</span>
            </Link>
            <p className="text-white/50 mb-6 leading-relaxed">
              Your one-stop destination for books, baby products, and premium leather goods.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-white/5 hover:bg-[#6366f1] rounded-full flex items-center justify-center transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/50 hover:text-[#6366f1] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/50 hover:text-[#6366f1] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/50 hover:text-[#6366f1] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#6366f1] flex-shrink-0 mt-0.5" />
                <span className="text-white/50">123 Book Street, Reading City, RC 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#6366f1] flex-shrink-0" />
                <span className="text-white/50">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#6366f1] flex-shrink-0" />
                <span className="text-white/50">support@bookstore.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm text-center md:text-left">
              © 2024 BookStore. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <CreditCard className="w-8 h-5 text-white/20" />
              <div className="w-10 h-6 bg-white/10 rounded" />
              <div className="w-10 h-6 bg-white/10 rounded" />
              <div className="w-10 h-6 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
