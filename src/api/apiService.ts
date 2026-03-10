// API Service - Mock implementation that can be replaced with real backend
import type { 
  Product, Category, Review, CartItem, Order, User, Address 
} from '../data/mockDatabase';
import { 
  products, categories, reviews, coupons, orders, users,
  getProductById, getProductsByCategory, getReviewsByProduct, getFeaturedProducts, 
  getNewProducts, searchProducts 
} from '../data/mockDatabase';

// Local mutable cart storage
let localCartItems: CartItem[] = [];
let localWishlistItems: { userId: string; productId: string }[] = [];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API
export const authAPI = {
  register: async (email: string, _password: string, firstName: string, lastName: string): Promise<{ user: User; token: string }> => {
    await delay(800);
    
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      firstName,
      lastName,
      avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=6366f1&color=fff`,
      role: 'user',
      addresses: [],
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    const token = `jwt-token-${newUser.id}`;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return { user: newUser, token };
  },
  
  login: async (email: string, _password: string): Promise<{ user: User; token: string }> => {
    await delay(800);
    
    const user = users.find(u => u.email === email);
    if (!user) {
      // Create demo user if not exists
      if (email === 'demo@example.com') {
        const demoUser: User = {
          id: 'user-demo',
          email: 'demo@example.com',
          firstName: 'Demo',
          lastName: 'User',
          avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=6366f1&color=fff',
          role: 'user',
          addresses: [],
          createdAt: new Date().toISOString(),
        };
        users.push(demoUser);
        const token = `jwt-token-${demoUser.id}`;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(demoUser));
        return { user: demoUser, token };
      }
      throw new Error('Invalid credentials');
    }
    
    const token = `jwt-token-${user.id}`;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { user, token };
  },
  
  logout: async (): Promise<void> => {
    await delay(300);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    await delay(300);
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    await delay(600);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');
    
    users[userIndex] = { ...users[userIndex], ...data };
    localStorage.setItem('user', JSON.stringify(users[userIndex]));
    return users[userIndex];
  },
};

// Products API
export const productsAPI = {
  getAll: async (params?: { 
    category?: string; 
    featured?: boolean; 
    new?: boolean;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> => {
    await delay(500);
    
    let result = [...products];
    
    if (params?.category) {
      result = getProductsByCategory(params.category);
    }
    
    if (params?.featured) {
      result = getFeaturedProducts();
    }
    
    if (params?.new) {
      result = getNewProducts();
    }
    
    if (params?.search) {
      result = searchProducts(params.search);
    }
    
    // Sorting
    if (params?.sort) {
      switch (params.sort) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
      }
    }
    
    const page = params?.page || 1;
    const limit = params?.limit || 12;
    const total = result.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginated = result.slice(start, start + limit);
    
    return { products: paginated, total, page, totalPages };
  },
  
  getById: async (id: string): Promise<Product> => {
    await delay(400);
    const product = getProductById(id);
    if (!product) throw new Error('Product not found');
    return product;
  },
  
  getBySlug: async (slug: string): Promise<Product> => {
    await delay(400);
    const product = products.find(p => p.slug === slug);
    if (!product) throw new Error('Product not found');
    return product;
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async (): Promise<Category[]> => {
    await delay(300);
    return categories;
  },
  
  getById: async (id: string): Promise<Category> => {
    await delay(300);
    const category = categories.find(c => c.id === id);
    if (!category) throw new Error('Category not found');
    return category;
  },
  
  getBySlug: async (slug: string): Promise<Category> => {
    await delay(300);
    const category = categories.find(c => c.slug === slug);
    if (!category) throw new Error('Category not found');
    return category;
  },
};

// Reviews API
export const reviewsAPI = {
  getByProduct: async (productId: string): Promise<Review[]> => {
    await delay(400);
    return getReviewsByProduct(productId);
  },
  
  create: async (data: Omit<Review, 'id' | 'createdAt'>): Promise<Review> => {
    await delay(800);
    const newReview: Review = {
      ...data,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    reviews.push(newReview);
    return newReview;
  },
  
  markHelpful: async (reviewId: string): Promise<Review> => {
    await delay(400);
    const review = reviews.find(r => r.id === reviewId);
    if (!review) throw new Error('Review not found');
    review.helpfulCount++;
    return review;
  },
};

// Cart API
export const cartAPI = {
  get: async (_userId?: string): Promise<CartItem[]> => {
    await delay(300);
    return localCartItems;
  },
  
  addItem: async (productId: string, quantity: number = 1, variantId?: string): Promise<CartItem[]> => {
    await delay(500);
    
    const product = getProductById(productId);
    if (!product) throw new Error('Product not found');
    
    const existingItem = localCartItems.find((item: CartItem) => 
      item.productId === productId && item.variantId === variantId
    );
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const variant = product.variants?.find(v => v.id === variantId);
      localCartItems.push({
        id: `cart-${Date.now()}`,
        productId,
        variantId,
        quantity,
        product,
        variant,
      });
    }
    
    return localCartItems;
  },
  
  updateItem: async (cartItemId: string, quantity: number): Promise<CartItem[]> => {
    await delay(400);
    
    const item = localCartItems.find((i: CartItem) => i.id === cartItemId);
    if (!item) throw new Error('Cart item not found');
    
    if (quantity <= 0) {
      localCartItems = localCartItems.filter((i: CartItem) => i.id !== cartItemId);
    } else {
      item.quantity = quantity;
    }
    
    return localCartItems;
  },
  
  removeItem: async (cartItemId: string): Promise<CartItem[]> => {
    await delay(400);
    localCartItems = localCartItems.filter((i: CartItem) => i.id !== cartItemId);
    return localCartItems;
  },
  
  clear: async (): Promise<void> => {
    await delay(300);
    localCartItems = [];
  },
  
  applyCoupon: async (code: string): Promise<{ discount: number; message: string }> => {
    await delay(600);
    
    const coupon = coupons.find(c => c.code === code.toUpperCase());
    if (!coupon) throw new Error('Invalid coupon code');
    if (coupon.usedCount >= coupon.maxUses) throw new Error('Coupon has expired');
    if (new Date(coupon.expiresAt) < new Date()) throw new Error('Coupon has expired');
    
    return { 
      discount: coupon.value, 
      message: `Coupon applied! ${coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`} off` 
    };
  },
};

// Wishlist API
export const wishlistAPI = {
  get: async (userId: string): Promise<Product[]> => {
    await delay(400);
    const userWishlist = localWishlistItems.filter(w => w.userId === userId);
    return userWishlist.map(w => getProductById(w.productId)!).filter(Boolean);
  },
  
  add: async (userId: string, productId: string): Promise<void> => {
    await delay(400);
    if (!localWishlistItems.find(w => w.userId === userId && w.productId === productId)) {
      localWishlistItems.push({ userId, productId });
    }
  },
  
  remove: async (userId: string, productId: string): Promise<void> => {
    await delay(400);
    localWishlistItems = localWishlistItems.filter(w => !(w.userId === userId && w.productId === productId));
  },
  
  isInWishlist: async (userId: string, productId: string): Promise<boolean> => {
    await delay(200);
    return localWishlistItems.some(w => w.userId === userId && w.productId === productId);
  },
};

// Orders API
export const ordersAPI = {
  getAll: async (userId: string): Promise<Order[]> => {
    await delay(500);
    return orders.filter(o => o.userId === userId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
  
  getById: async (orderId: string): Promise<Order> => {
    await delay(400);
    const order = orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');
    return order;
  },
  
  create: async (data: {
    userId: string;
    items: { productId: string; variantId?: string; quantity: number }[];
    shippingAddress: Address;
    billingAddress: Address;
    paymentMethod: string;
    couponCode?: string;
  }): Promise<Order> => {
    await delay(1000);
    
    let subtotal = 0;
    const orderItems: Order['items'] = [];
    
    for (const item of data.items) {
      const product = getProductById(item.productId);
      if (!product) continue;
      
      const variant = product.variants?.find(v => v.id === item.variantId);
      const price = variant?.price || product.price;
      
      orderItems.push({
        id: `oi-${Date.now()}-${Math.random()}`,
        productId: item.productId,
        variantId: item.variantId,
        name: product.name,
        image: product.images[0],
        quantity: item.quantity,
        price,
      });
      
      subtotal += price * item.quantity;
    }
    
    // Calculate discount
    let discount = 0;
    if (data.couponCode) {
      const coupon = coupons.find(c => c.code === data.couponCode);
      if (coupon) {
        discount = coupon.type === 'percentage' 
          ? subtotal * (coupon.value / 100)
          : coupon.value;
      }
    }
    
    const tax = subtotal * 0.08;
    const shipping = subtotal > 50 ? 0 : 9.99;
    const total = subtotal + tax + shipping - discount;
    
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      userId: data.userId,
      status: 'pending',
      items: orderItems,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      shippingAddress: data.shippingAddress,
      billingAddress: data.billingAddress,
      paymentMethod: data.paymentMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    orders.push(newOrder);
    
    // Clear cart after order
    localCartItems = [];
    
    return newOrder;
  },
  
  getTracking: async (orderId: string): Promise<Order['tracking']> => {
    await delay(600);
    const order = orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');
    
    // Generate mock tracking if not exists
    if (!order.tracking) {
      order.tracking = {
        carrier: 'FedEx',
        trackingNumber: `FX${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        events: [
          { status: 'Order Placed', location: 'Online', timestamp: order.createdAt },
          { status: 'Order Confirmed', location: 'Warehouse', timestamp: new Date(Date.now() - 86400000).toISOString() },
          { status: 'Shipped', location: 'Distribution Center', timestamp: new Date(Date.now() - 43200000).toISOString() },
        ],
      };
    }
    
    return order.tracking;
  },
};

// Admin API
export const adminAPI = {
  getDashboardStats: async (): Promise<{
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    totalProducts: number;
    recentOrders: Order[];
    salesByMonth: { month: string; sales: number }[];
  }> => {
    await delay(800);
    
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    
    const salesByMonth = [
      { month: 'Jan', sales: 12500 },
      { month: 'Feb', sales: 15200 },
      { month: 'Mar', sales: 18900 },
      { month: 'Apr', sales: 22400 },
      { month: 'May', sales: 19800 },
      { month: 'Jun', sales: 25600 },
    ];
    
    return {
      totalOrders: orders.length,
      totalRevenue,
      totalCustomers: users.length,
      totalProducts: products.length,
      recentOrders: orders.slice(0, 5),
      salesByMonth,
    };
  },
  
  getAllOrders: async (): Promise<Order[]> => {
    await delay(600);
    return orders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
  
  updateOrderStatus: async (orderId: string, status: Order['status']): Promise<Order> => {
    await delay(500);
    const order = orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return order;
  },
  
  createProduct: async (data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    await delay(800);
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    products.push(newProduct);
    return newProduct;
  },
  
  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    await delay(600);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    products[index] = { ...products[index], ...data };
    return products[index];
  },
  
  deleteProduct: async (id: string): Promise<void> => {
    await delay(500);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    products.splice(index, 1);
  },
};
