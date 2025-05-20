
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

const AddressForm = ({ savedAddresses = dummyAddresses, onSelectAddress, onConfirm }: AddressFormProps) => {
  const [isAddNew, setIsAddNew] = useState(false);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    savedAddresses.find(addr => addr.isDefault)?.id || null
  );
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    flatNumber: "",
    street: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
    landmark: ""
  });
  const { toast } = useToast();

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selectedAddress = savedAddresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      onSelectAddress(selectedAddress);
    }
  };

  const handleAddNewAddress = () => {
    if (!newAddress.flatNumber || !newAddress.street || !newAddress.city || !newAddress.pincode) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const fullAddress = {
      id: `new-${Date.now()}`,
      flatNumber: newAddress.flatNumber || "",
      street: newAddress.street || "",
      city: newAddress.city || "",
      state: newAddress.state || "Maharashtra",
      pincode: newAddress.pincode || "",
      landmark: newAddress.landmark
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
    setNewAddress(prev => ({
      ...prev,
      street: "Selected from map: Gandhi Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001"
    }));
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
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="flatNumber">Flat/House Number*</Label>
              <Input
                id="flatNumber"
                value={newAddress.flatNumber}
                onChange={(e) => setNewAddress({...newAddress, flatNumber: e.target.value})}
                placeholder="Flat/House Number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Street/Area*</Label>
              <div className="flex">
                <Input
                  id="street"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                  placeholder="Street/Area"
                  className="rounded-r-none"
                />
                <Dialog open={isMapDialogOpen} onOpenChange={setIsMapDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="rounded-l-none border-l-0"
                      onClick={handleOpenMap}
                    >
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Select location on map</DialogTitle>
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City*</Label>
              <Input
                id="city"
                value={newAddress.city}
                onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State*</Label>
              <Input
                id="state"
                value={newAddress.state}
                onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                placeholder="State"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode*</Label>
              <Input
                id="pincode"
                value={newAddress.pincode}
                onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                placeholder="Pincode"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="landmark">Landmark (Optional)</Label>
              <Input
                id="landmark"
                value={newAddress.landmark}
                onChange={(e) => setNewAddress({...newAddress, landmark: e.target.value})}
                placeholder="Landmark"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsAddNew(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-black text-white hover:bg-gray-800"
              onClick={handleAddNewAddress}
            >
              Save Address
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressForm;
