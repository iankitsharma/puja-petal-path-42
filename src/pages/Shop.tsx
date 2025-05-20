
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Product, Address } from "@/types/models";
import { ShoppingBag, X, Plus, Minus } from "lucide-react";
import { useAuthCheck } from "@/utils/authUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddressForm from "@/components/address/AddressForm";

// Sample product data
const products: Product[] = [
  {
    id: "1",
    name: "Marigold Mala",
    description: "Fresh marigold flowers strung by hand",
    price: 50,
    image_url: "https://images.unsplash.com/photo-1600207407889-ce31a0c724ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "mala",
    in_stock: true
  },
  {
    id: "2",
    name: "Rose Mala",
    description: "Beautiful rose petals crafted into an elegant mala",
    price: 80,
    image_url: "https://images.unsplash.com/photo-1596073419667-9d77d59f033f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "mala",
    in_stock: true
  },
  {
    id: "3",
    name: "Mogra Mala",
    description: "Fragrant mogra jasmine flowers for special occasions",
    price: 100,
    image_url: "https://images.unsplash.com/photo-1602526430780-782d6b1783fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "mala",
    in_stock: true
  },
  {
    id: "4",
    name: "Loose Marigold Flowers",
    description: "Fresh marigold petals for decoration or puja",
    price: 30,
    image_url: "https://images.unsplash.com/photo-1599733687773-14a89021d887?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "loose_flowers",
    in_stock: true
  },
  {
    id: "5",
    name: "Loose Rose Petals",
    description: "Fragrant rose petals for decoration",
    price: 40,
    image_url: "https://images.unsplash.com/photo-1596462101992-51d11f0c94dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "loose_flowers",
    in_stock: true
  },
  {
    id: "6",
    name: "Loose Mogra Flowers",
    description: "Aromatic mogra flowers for special occasions",
    price: 60,
    image_url: "https://images.unsplash.com/photo-1591024355637-a41003c4c04d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "loose_flowers",
    in_stock: true
  }
];

// Sample addresses data
const sampleAddresses: Address[] = [
  {
    id: "addr1",
    user_id: "user1",
    address_line1: "123 Puja Lane",
    address_line2: "Apartment 4B",
    city: "Mumbai",
    state: "Maharashtra",
    postal_code: "400001",
    landmark: "Near Shiva Temple",
    is_default: true,
    address_type: "home"
  },
  {
    id: "addr2",
    user_id: "user1",
    address_line1: "456 Devotion Street",
    city: "Mumbai",
    state: "Maharashtra",
    postal_code: "400002",
    is_default: false,
    address_type: "work"
  }
];

interface CartItem {
  product: Product;
  quantity: number;
}

const Shop = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const { toast } = useToast();
  const checkAuth = useAuthCheck();
  
  const addToCart = (product: Product) => {
    // Check if user is authenticated before adding to cart
    if (!checkAuth()) return;
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };
  
  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };
  
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };
  
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };
  
  const calculateDeliveryFee = () => {
    const subtotal = calculateSubtotal();
    return subtotal < 399 ? 49 : 0;
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFee();
  };
  
  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };
  
  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory) 
    : products;
  
  const categories = [
    { id: "mala", name: "Malas" },
    { id: "loose_flowers", name: "Loose Flowers" },
    { id: "other", name: "Other Items" }
  ];

  const handleCheckout = () => {
    // Check if user is authenticated before checkout
    if (!checkAuth()) return;
    
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out",
        variant: "destructive"
      });
      return;
    }
    
    // Open the address selection dialog
    setShowAddressDialog(true);
  };
  
  const handleAddressSelection = (address: any) => {
    setSelectedAddress(address);
    
    toast({
      title: "Address selected",
      description: "Your delivery address has been selected",
    });
  };
  
  const handleProceedToPayment = () => {
    if (!selectedAddress) {
      toast({
        title: "Address required",
        description: "Please select a delivery address",
        variant: "destructive"
      });
      return;
    }
    
    // Close the dialog
    setShowAddressDialog(false);
    
    toast({
      title: "Proceeding to payment",
      description: "Redirecting to payment gateway...",
    });
    
    // Here we would redirect to payment page or process
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <h2 className="text-xl font-bold mb-6">Categories</h2>
            <div className="space-y-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                className={`w-full justify-start ${selectedCategory === null ? 'bg-black text-white' : ''}`}
                onClick={() => setSelectedCategory(null)}
              >
                All Products
              </Button>
              
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className={`w-full justify-start ${selectedCategory === category.id ? 'bg-black text-white' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Shop</h1>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative">
                    <ShoppingBag className="mr-2" size={18} />
                    <span>Cart</span>
                    {getTotalItems() > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-black text-white">
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Your Cart</SheetTitle>
                  </SheetHeader>
                  
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[70vh]">
                      <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                      <p className="text-gray-500">Your cart is empty</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => document.querySelector('[data-radix-collection-item]')?.dispatchEvent(
                          new MouseEvent('click', { bubbles: true })
                        )}
                      >
                        Continue Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-8 space-y-6">
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div key={item.product.id} className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <div className="flex items-center">
                              <div className="h-16 w-16 rounded overflow-hidden mr-4">
                                <img 
                                  src={item.product.image_url} 
                                  alt={item.product.name} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium">{item.product.name}</h4>
                                <p className="text-sm text-gray-600">₹{item.product.price}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <div className="flex items-center border rounded-md mr-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-r-none"
                                  onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                                >
                                  <Minus size={14} />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-l-none"
                                  onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                                >
                                  <Plus size={14} />
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500"
                                onClick={() => removeFromCart(item.product.id)}
                              >
                                <X size={16} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal</span>
                          <span>₹{calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Delivery Fee</span>
                          <span>₹{calculateDeliveryFee().toFixed(2)}</span>
                        </div>
                        {calculateDeliveryFee() > 0 && (
                          <p className="text-xs text-gray-500">
                            Free delivery on orders above ₹399
                          </p>
                        )}
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span>₹{calculateTotal().toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-black text-white hover:bg-gray-800"
                        onClick={handleCheckout}
                      >
                        Proceed to Checkout
                      </Button>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">₹{product.price}</span>
                      <Button 
                        variant="outline" 
                        onClick={() => addToCart(product)}
                        className="border-black hover:bg-gray-50"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Address Selection Dialog */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Delivery Address</DialogTitle>
          </DialogHeader>
          <AddressForm 
            savedAddresses={
              sampleAddresses.map(addr => ({
                id: addr.id,
                flatNumber: addr.address_line1.split(',')[0] || "",
                street: addr.address_line2 || addr.address_line1.split(',').slice(1).join(',') || "",
                city: addr.city,
                state: addr.state,
                pincode: addr.postal_code,
                landmark: addr.landmark,
                isDefault: addr.is_default
              }))
            }
            onSelectAddress={handleAddressSelection}
            onConfirm={handleProceedToPayment}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Shop;
