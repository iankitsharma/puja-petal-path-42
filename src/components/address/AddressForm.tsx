
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export interface Address {
  id?: string;
  flatNumber: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
}

interface AddressFormProps {
  savedAddresses?: Address[];
  onSelectAddress: (address: Address) => void;
  onConfirm: () => void;
}

const dummyAddresses: Address[] = [
  {
    id: "1",
    flatNumber: "402",
    street: "Shree Apartment, MG Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    landmark: "Near Central Mall",
    isDefault: true
  },
  {
    id: "2",
    flatNumber: "203",
    street: "Green Valley, Anna Salai",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600002",
    landmark: "Opposite Phoenix Mall"
  }
];

const formSchema = z.object({
  flatNumber: z.string().min(1, "Flat/House Number is required"),
  street: z.string().min(1, "Street/Area is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Must be a 6 digit postal code"),
  landmark: z.string().optional()
});

const AddressForm = ({ savedAddresses = dummyAddresses, onSelectAddress, onConfirm }: AddressFormProps) => {
  const [isAddNew, setIsAddNew] = useState(false);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    savedAddresses.find(addr => addr.isDefault)?.id || null
  );
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      flatNumber: "",
      street: "",
      city: "",
      state: "Maharashtra",
      pincode: "",
      landmark: ""
    }
  });

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selectedAddress = savedAddresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      onSelectAddress(selectedAddress);
    }
  };

  const handleAddNewAddress = (values: z.infer<typeof formSchema>) => {
    const fullAddress = {
      id: `new-${Date.now()}`,
      flatNumber: values.flatNumber,
      street: values.street,
      city: values.city,
      state: values.state,
      pincode: values.pincode,
      landmark: values.landmark
    };

    onSelectAddress(fullAddress);
    setSelectedAddressId(fullAddress.id);
    setIsAddNew(false);
    
    toast({
      title: "Address added",
      description: "Your new delivery address has been added"
    });
  };

  const handleOpenMap = () => {
    setIsMapDialogOpen(true);
  };

  const handleMapSelection = () => {
    // In a real implementation, this would get coordinates and address data from Maps API
    form.setValue("street", "Selected from map: Gandhi Road");
    form.setValue("city", "Mumbai");
    form.setValue("state", "Maharashtra");
    form.setValue("pincode", "400001");
    setIsMapDialogOpen(false);
    
    toast({
      title: "Location selected",
      description: "Address details have been updated from map"
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Delivery Address</h3>
        <p className="text-sm text-gray-500">Select a delivery address or add a new one</p>
      </div>

      {!isAddNew && (
        <>
          <div className="space-y-3">
            {savedAddresses.map((address) => (
              <div
                key={address.id}
                className={`border rounded-lg p-3 cursor-pointer ${
                  selectedAddressId === address.id ? "border-black" : "border-gray-200"
                }`}
                onClick={() => handleSelectAddress(address.id!)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${
                      selectedAddressId === address.id ? "bg-black" : "border border-gray-400"
                    }`}></div>
                    <div>
                      <p className="font-medium">{address.flatNumber}, {address.street}</p>
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                      {address.landmark && (
                        <p className="text-xs text-gray-500">Landmark: {address.landmark}</p>
                      )}
                    </div>
                  </div>
                  {address.isDefault && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Default</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full border-dashed"
            onClick={() => setIsAddNew(true)}
          >
            + Add New Address
          </Button>

          <div className="flex justify-end">
            <Button 
              className="bg-black text-white hover:bg-gray-800"
              onClick={onConfirm}
              disabled={!selectedAddressId}
            >
              Continue to Payment
            </Button>
          </div>
        </>
      )}

      {isAddNew && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddNewAddress)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="flatNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flat/House Number*</FormLabel>
                    <FormControl>
                      <Input placeholder="Flat/House Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street/Area*</FormLabel>
                      <div className="flex">
                        <FormControl>
                          <Input 
                            placeholder="Street/Area" 
                            {...field} 
                            className="rounded-r-none"
                          />
                        </FormControl>
                        <Dialog open={isMapDialogOpen} onOpenChange={setIsMapDialogOpen}>
                          <Button 
                            type="button"
                            variant="outline" 
                            className="rounded-l-none border-l-0"
                            onClick={handleOpenMap}
                          >
                            <MapPin className="w-4 h-4" />
                          </Button>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Select location on map</DialogTitle>
                              <DialogDescription>
                                Choose your location from the map to automatically fill address details.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-6">
                              <div className="border rounded-md bg-gray-50 p-12 flex items-center justify-center">
                                <div className="text-center text-gray-500 space-y-3">
                                  <AlertCircle className="h-10 w-10 mx-auto text-gray-400" />
                                  <p>Google Maps would appear here in a full implementation</p>
                                  <Button onClick={handleMapSelection}>Select this location</Button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City*</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State*</FormLabel>
                    <FormControl>
                      <Input placeholder="State" {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode*</FormLabel>
                    <FormControl>
                      <Input placeholder="6-digit pincode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="landmark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Landmark (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Landmark" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button type="button" variant="outline" onClick={() => setIsAddNew(false)}>
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-black text-white hover:bg-gray-800"
              >
                Save Address
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default AddressForm;
