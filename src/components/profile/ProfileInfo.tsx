
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PenSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
}

interface ProfileInfoProps {
  initialData?: ProfileData;
  onLogout?: () => Promise<void>;
}

const ProfileInfo = ({ initialData, onLogout }: ProfileInfoProps = {}) => {
  const { user, profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedData, setEditedData] = useState<ProfileData>({
    fullName: initialData?.fullName || profile?.full_name || '',
    email: initialData?.email || profile?.email || user?.email || '',
    phone: initialData?.phone || profile?.phone?.replace('+91', '') || ''
  });
  
  const { toast } = useToast();
  const { signOut } = useAuth();
  
  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Format phone with country code if changed
      const formattedPhone = editedData.phone.startsWith('+91')
        ? editedData.phone
        : `+91${editedData.phone}`;
      
      const { error } = await supabase
        .from('users_profile')
        .update({
          full_name: editedData.fullName,
          email: editedData.email || null,
          phone: formattedPhone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved",
      });
      
      // Reload the page to refresh the profile data
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (onLogout) {
        await onLogout();
      } else {
        await signOut();
        
        toast({
          title: "Logged out",
          description: "You have been successfully logged out",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="w-full space-y-6">
      {/* Personal Information */}
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
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editedData.email}
                onChange={(e) => setEditedData({...editedData, email: e.target.value})}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editedData.phone}
                onChange={(e) => setEditedData({
                  ...editedData, 
                  phone: e.target.value.replace(/\D/g, '').slice(0, 10)
                })}
                disabled={isLoading}
              />
            </div>
            
            <Button 
              className="w-full bg-black text-white hover:bg-gray-800"
              onClick={handleSaveProfile}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <div className="space-y-1">
              <Label className="text-gray-500 text-sm">Full Name</Label>
              <p className="font-medium">{profile?.full_name || 'Not provided'}</p>
            </div>
            
            <div className="space-y-1">
              <Label className="text-gray-500 text-sm">Email</Label>
              <p className="font-medium">{profile?.email || user?.email || 'Not provided'}</p>
            </div>
            
            <div className="space-y-1">
              <Label className="text-gray-500 text-sm">Phone</Label>
              <p className="font-medium">{profile?.phone || 'Not provided'}</p>
            </div>
            
            <div className="space-y-1">
              <Label className="text-gray-500 text-sm">Authentication Provider</Label>
              <p className="font-medium capitalize">{
                user?.app_metadata?.provider || 'phone'
              }</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Logout button at bottom of profile */}
      <Button 
        variant="outline" 
        onClick={handleLogout} 
        className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
      >
        Logout
      </Button>
    </div>
  );
};

export default ProfileInfo;
