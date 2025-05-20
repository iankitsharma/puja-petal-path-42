
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PenSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfileInfoProps {
  initialData: {
    fullName: string;
    email: string;
    phone: string;
  };
}

const ProfileInfo = ({ initialData }: ProfileInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(initialData);
  const [editedData, setEditedData] = useState(userData);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const handleSaveProfile = () => {
    setUserData(editedData);
    setIsEditing(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved",
    });
  };
  
  return (
    <div className={`${isMobile ? 'w-full' : 'max-w-md mx-auto md:mx-0'}`}>
      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium">Personal Information</h2>
          <Button
            variant="ghost"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center"
          >
            <PenSquare size={16} className="mr-2" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>
        
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={editedData.fullName}
                onChange={(e) => setEditedData({...editedData, fullName: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editedData.email}
                onChange={(e) => setEditedData({...editedData, email: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editedData.phone}
                onChange={(e) => setEditedData({...editedData, phone: e.target.value})}
              />
            </div>
            
            <Button 
              className="w-full bg-black text-white hover:bg-gray-800"
              onClick={handleSaveProfile}
            >
              Save Changes
            </Button>
          </div>
        ) : (
          <div className={`${isMobile ? 'flex flex-col space-y-4' : 'space-y-4'}`}>
            <div className="space-y-1">
              <Label className="text-gray-500 text-sm">Full Name</Label>
              <p className="font-medium">{userData.fullName}</p>
            </div>
            
            <div className="space-y-1">
              <Label className="text-gray-500 text-sm">Email</Label>
              <p className="font-medium">{userData.email}</p>
            </div>
            
            <div className="space-y-1">
              <Label className="text-gray-500 text-sm">Phone</Label>
              <p className="font-medium">{userData.phone}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
