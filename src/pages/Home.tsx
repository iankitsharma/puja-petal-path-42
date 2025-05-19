
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/layout/Layout";
import { Product } from "@/types/models";
import { useToast } from "@/hooks/use-toast";

// Sample product data
const malaProducts: Product[] = [
  {
    id: "1",
    name: "Marigold Mala",
    description: "Fresh marigold flowers strung by hand for daily puja rituals",
    price: 50,
    image_url: "https://images.unsplash.com/photo-1600207407889-ce31a0c724ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "mala",
    in_stock: true
  },
  {
    id: "2",
    name: "Rose Mala",
    description: "Beautiful rose petals crafted into an elegant mala for your deity",
    price: 80,
    image_url: "https://images.unsplash.com/photo-1596073419667-9d77d59f033f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "mala",
    in_stock: true
  },
  {
    id: "3",
    name: "Mogra Mala",
    description: "Fragrant mogra jasmine flowers perfect for special occasions",
    price: 100,
    image_url: "https://images.unsplash.com/photo-1602526430780-782d6b1783fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "mala",
    in_stock: true
  }
];

const Home = () => {
  const [selectedMalas, setSelectedMalas] = useState<Record<string, number>>({});
  const [deliverySlot, setDeliverySlot] = useState<'morning' | 'evening'>('morning');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [duration, setDuration] = useState<'1_week' | '1_month'>('1_month');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const { toast } = useToast();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const toggleMalaSelection = (productId: string) => {
    setSelectedMalas(prev => {
      const newSelection = { ...prev };
      if (newSelection[productId]) {
        delete newSelection[productId];
      } else {
        newSelection[productId] = 1;
      }
      return newSelection;
    });
  };
  
  const updateMalaQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setSelectedMalas(prev => ({ ...prev, [productId]: quantity }));
  };
  
  const toggleDaySelection = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day]
    );
  };
  
  const calculateTotal = () => {
    let total = 0;
    
    if (selectedPackage === 'daily_1') {
      // 10% off daily 1 mala for 1 month
      const product = malaProducts.find(p => p.id === "1");
      if (product) {
        total = product.price * 30 * 0.9;
      }
      return total;
    } else if (selectedPackage === 'daily_2') {
      // 15% off daily 2 malas for 1 month
      const product1 = malaProducts.find(p => p.id === "1");
      const product2 = malaProducts.find(p => p.id === "2");
      if (product1 && product2) {
        total = (product1.price + product2.price) * 30 * 0.85;
      }
      return total;
    }
    
    // Calculate from individual selections
    Object.entries(selectedMalas).forEach(([productId, quantity]) => {
      const product = malaProducts.find(p => p.id === productId);
      if (product) {
        const days = frequency === 'daily' 
          ? (duration === '1_week' ? 7 : 30) 
          : (selectedDays.length * (duration === '1_week' ? 1 : 4));
        
        total += product.price * quantity * days;
      }
    });
    
    return total;
  };

  const handleSubscribe = () => {
    // Check if selections are made
    if (Object.keys(selectedMalas).length === 0 && !selectedPackage) {
      toast({
        title: "Selection required",
        description: "Please select at least one mala type",
        variant: "destructive"
      });
      return;
    }
    
    if (frequency === 'weekly' && selectedDays.length === 0) {
      toast({
        title: "Days selection required",
        description: "Please select at least one day for weekly delivery",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Subscription initiated",
      description: "Please complete the payment to confirm your subscription",
    });
    
    // Here we would redirect to payment or show payment form
    setIsDialogOpen(false);
  };
  
  return (
    <Layout>
      <section className="px-4 py-12 md:pt-24 animate-fade-in">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Devotion Delivered Daily</h1>
            <p className="text-lg text-gray-600 mb-8">
              Fresh flower malas for your daily puja rituals, delivered right to your doorstep
            </p>
            <Button className="bg-black text-white hover:bg-gray-800" size="lg">
              Start Your Devotional Journey
            </Button>
          </div>
        </div>
      </section>
      
      <section className="px-4 py-12 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Choose Your Mala Subscription</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {malaProducts.map((product) => (
              <div key={product.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col">
                <div className="aspect-square overflow-hidden rounded-md mb-4">
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{product.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium">₹{product.price} per mala</span>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full border-black hover:bg-gray-50">
                      Subscribe
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl">Create Your Mala Subscription</DialogTitle>
                    </DialogHeader>
                    
                    <div className="py-4 space-y-6">
                      {/* Mala Selection */}
                      <div>
                        <h3 className="font-medium mb-3">Select Your Malas</h3>
                        <div className="space-y-3">
                          {malaProducts.map((product) => (
                            <div key={product.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                              <div className="flex items-center">
                                <Checkbox 
                                  id={`mala-${product.id}`} 
                                  checked={!!selectedMalas[product.id]}
                                  onCheckedChange={() => toggleMalaSelection(product.id)}
                                  className="mr-2"
                                />
                                <Label htmlFor={`mala-${product.id}`} className="font-normal">
                                  {product.name} - ₹{product.price}
                                </Label>
                              </div>
                              
                              {selectedMalas[product.id] && (
                                <div className="flex items-center">
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => updateMalaQuantity(product.id, selectedMalas[product.id] - 1)}
                                  >
                                    -
                                  </Button>
                                  <span className="mx-2 w-8 text-center">
                                    {selectedMalas[product.id]}
                                  </span>
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => updateMalaQuantity(product.id, selectedMalas[product.id] + 1)}
                                  >
                                    +
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Delivery Schedule */}
                      <div>
                        <h3 className="font-medium mb-3">Delivery Schedule</h3>
                        
                        <div className="space-y-4 mb-4">
                          <div>
                            <Label className="mb-2 block">Delivery Time</Label>
                            <Select value={deliverySlot} onValueChange={(value: 'morning' | 'evening') => setDeliverySlot(value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select delivery time" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="morning">Morning (6 AM - 9 AM)</SelectItem>
                                <SelectItem value="evening">Evening (4 PM - 7 PM)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="mb-2 block">Frequency</Label>
                            <RadioGroup value={frequency} onValueChange={(value: 'daily' | 'weekly') => setFrequency(value)}>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="daily" id="daily" />
                                <Label htmlFor="daily">Daily</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="weekly" id="weekly" />
                                <Label htmlFor="weekly">Weekly</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          
                          {frequency === 'weekly' && (
                            <div>
                              <Label className="mb-2 block">Select Days</Label>
                              <div className="grid grid-cols-2 gap-2">
                                {days.map((day) => (
                                  <div key={day} className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={day} 
                                      checked={selectedDays.includes(day)} 
                                      onCheckedChange={() => toggleDaySelection(day)}
                                    />
                                    <Label htmlFor={day} className="font-normal">{day}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <Label className="mb-2 block">Duration</Label>
                            <RadioGroup value={duration} onValueChange={(value: '1_week' | '1_month') => setDuration(value)}>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1_week" id="1_week" />
                                <Label htmlFor="1_week">1 Week</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1_month" id="1_month" />
                                <Label htmlFor="1_month">1 Month</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </div>
                      
                      {/* Pre-planned Packages */}
                      <div>
                        <h3 className="font-medium mb-3">Popular Packages</h3>
                        <div className="space-y-3">
                          <div 
                            className={`p-4 border rounded-md cursor-pointer transition-all ${
                              selectedPackage === 'daily_1' ? 'border-black bg-gray-50' : 'border-gray-200'
                            }`}
                            onClick={() => {
                              setSelectedPackage(selectedPackage === 'daily_1' ? null : 'daily_1');
                              if (selectedPackage !== 'daily_1') {
                                setSelectedMalas({});
                              }
                            }}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">Daily Marigold Mala (1 Month)</h4>
                              <div className="flex flex-col items-end">
                                <span className="text-sm line-through text-gray-500">₹1500</span>
                                <span className="font-semibold">₹1350</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">Daily delivery of 1 marigold mala for a month. 10% discount.</p>
                          </div>
                          
                          <div 
                            className={`p-4 border rounded-md cursor-pointer transition-all ${
                              selectedPackage === 'daily_2' ? 'border-black bg-gray-50' : 'border-gray-200'
                            }`}
                            onClick={() => {
                              setSelectedPackage(selectedPackage === 'daily_2' ? null : 'daily_2');
                              if (selectedPackage !== 'daily_2') {
                                setSelectedMalas({});
                              }
                            }}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">Daily 2 Malas Mix (1 Month)</h4>
                              <div className="flex flex-col items-end">
                                <span className="text-sm line-through text-gray-500">₹3900</span>
                                <span className="font-semibold">₹3315</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">Daily delivery of 2 malas (marigold + rose) for a month. 15% discount.</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Summary */}
                      <div className="border-t border-gray-200 pt-4">
                        <h3 className="font-medium mb-3">Summary</h3>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between">
                            <span>Total Cost</span>
                            <span className="font-semibold">₹{calculateTotal().toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full bg-black text-white hover:bg-gray-800"
                          onClick={handleSubscribe}
                        >
                          Proceed to Payment
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="px-4 py-12">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Why Choose MalaFlow?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6V12L16 14" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Fresh Daily Delivery</h3>
                <p className="text-gray-600 text-sm">Freshly picked flowers delivered daily for your puja rituals</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Flexible Subscriptions</h3>
                <p className="text-gray-600 text-sm">Choose your delivery frequency and customize your subscription</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 8V14" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 11H17" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Dedicated Support</h3>
                <p className="text-gray-600 text-sm">Our team is available to assist you with any questions or concerns</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
