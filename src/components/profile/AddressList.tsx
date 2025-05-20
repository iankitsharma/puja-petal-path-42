
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Address } from "@/types/models";
import { MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddressForm from "@/components/address/AddressForm";

interface AddressListProps {
  addresses: Address[];
}

const AddressList = ({ addresses }: AddressListProps) => {
  const { toast } = useToast();
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const handleSetDefaultAddress = (addressId: string) => {
    toast({
      title: "Address updated",
      description: "Default address has been updated",
    });
  };
  
  const handleAddressSelection = (address: any) => {
    // Handle the selected address
    toast({
      title: "Address selected",
      description: "Your delivery address has been selected",
    });
    setShowAddressForm(false);
  };
  
  const handleConfirm = () => {
    setShowAddressForm(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Saved Addresses</h2>
        <Button 
          className="bg-black text-white hover:bg-gray-800"
          onClick={() => setShowAddressForm(true)}
        >
          Add New Address
        </Button>
      </div>
      
      {addresses.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div 
              key={address.id} 
              className={`border rounded-lg p-5 relative ${address.is_default ? 'border-black shadow-sm' : 'border-gray-200'}`}
            >
              {address.is_default && (
                <div className="absolute top-2 right-2">
                  <span className="bg-black text-white text-xs py-1 px-2 rounded-full">
                    Default
                  </span>
                </div>
              )}
              
              <div className="flex items-start mb-4">
                <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">
                    {address.address_type.charAt(0).toUpperCase() + address.address_type.slice(1)}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {address.address_line1}
                    {address.address_line2 && <span>, {address.address_line2}</span>}
                    <br />
                    {address.city}, {address.state} {address.postal_code}
                    {address.landmark && <span><br />Landmark: {address.landmark}</span>}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs border-black hover:bg-gray-50">
                  Edit
                </Button>
                
                {!address.is_default && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs border-black hover:bg-gray-50"
                    onClick={() => handleSetDefaultAddress(address.id)}
                  >
                    Set as Default
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-gray-200 rounded-lg">
          <p className="text-gray-500 mb-4">You haven't saved any addresses yet</p>
          <Button 
            className="bg-black text-white hover:bg-gray-800"
            onClick={() => setShowAddressForm(true)}
          >
            Add New Address
          </Button>
        </div>
      )}
      
      <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <AddressForm 
            savedAddresses={
              addresses.map(addr => ({
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
            onConfirm={handleConfirm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressList;
