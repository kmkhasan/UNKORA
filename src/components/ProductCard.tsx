import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '../store/cartStore';
import { toast } from 'sonner';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating?: number;
  discount?: number;
  category: string;
  author?: string;
}

export default function ProductCard({
  id,
  name,
  price,
  oldPrice,
  image,
  rating = 4.5,
  discount,
  category,
  author,
}: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCartStore();
  const inWishlist = isInWishlist(id);

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      price,
      image,
      category,
    });
    toast.success(`${name} added to cart!`);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(id);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  const renderStars = () => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < Math.floor(rating) ? 'star-filled fill-current' : 'star-empty'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="product-card group bg-white rounded-xl overflow-hidden border border-gray-100">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={name}
          className="product-image w-full h-full object-cover"
        />

        {/* Discount Badge */}
        {discount && (
          <span className="absolute top-3 left-3 discount-badge animate-scale-in">
            -{discount}%
          </span>
        )}

        {/* Quick Actions */}
        <div className="quick-actions absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={handleToggleWishlist}
            className={`wishlist-btn w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center ${
              inWishlist ? 'active text-red-500' : 'text-gray-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
          <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-[#f06c4e] transition-colors">
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button
            onClick={handleAddToCart}
            className="add-to-cart w-full bg-[#f06c4e] hover:bg-[#283b59] text-white gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <span className="text-xs text-[#f06c4e] font-medium uppercase tracking-wide">
          {category}
        </span>

        {/* Title */}
        <h3 className="font-semibold text-[#283b59] mt-1 line-clamp-2 min-h-[48px]">
          {name}
        </h3>

        {/* Author */}
        {author && (
          <p className="text-sm text-gray-500 mt-1">{author}</p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          {renderStars()}
          <span className="text-xs text-gray-500">({rating})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span className="price-current text-lg font-bold">
            ${price.toFixed(2)}
          </span>
          {oldPrice && (
            <span className="price-old">${oldPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
