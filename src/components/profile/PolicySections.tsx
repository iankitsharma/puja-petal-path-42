
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Info, Shield, FileText, ShieldOff } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PolicySections = () => {
  // State to track which sections are open
  const [contactOpen, setContactOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  
  return (
    <div className="space-y-4">
      {/* Contact Us Section */}
      <Collapsible open={contactOpen} onOpenChange={setContactOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info size={18} />
                  <CardTitle className="text-lg">Contact Us</CardTitle>
                </div>
                <span className="text-gray-400 text-sm">Click to expand</span>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-3">
                <p>We're here to help with any questions or concerns you might have about our products or services.</p>
                <div className="space-y-1">
                  <p><strong>Email:</strong> support@malaflow.com</p>
                  <p><strong>Phone:</strong> +91 98765 43210</p>
                  <p><strong>Hours:</strong> Monday to Saturday, 9:00 AM to 6:00 PM IST</p>
                </div>
                <Button variant="outline" className="mt-2">Send us a message</Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Privacy Policy Section */}
      <Collapsible open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield size={18} />
                  <CardTitle className="text-lg">Privacy Policy</CardTitle>
                </div>
                <span className="text-gray-400 text-sm">Click to expand</span>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Last updated: May 15, 2025</p>
                <p>At MalaFlow, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.</p>
                <h4 className="font-medium mt-3">Information We Collect</h4>
                <p>We collect personal information such as your name, email address, phone number, and delivery address when you create an account or place an order.</p>
                <h4 className="font-medium mt-3">How We Use Your Information</h4>
                <p>We use your information to process orders, provide customer service, and send you updates about your orders and our products.</p>
                <Button variant="outline" className="mt-2">Read Full Policy</Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Terms and Conditions Section */}
      <Collapsible open={termsOpen} onOpenChange={setTermsOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={18} />
                  <CardTitle className="text-lg">Terms and Conditions</CardTitle>
                </div>
                <span className="text-gray-400 text-sm">Click to expand</span>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Last updated: May 15, 2025</p>
                <p>By using our website and services, you agree to these Terms and Conditions. Please read them carefully.</p>
                <h4 className="font-medium mt-3">Acceptance of Terms</h4>
                <p>By accessing or using our services, you agree to be bound by these Terms and all applicable laws and regulations.</p>
                <h4 className="font-medium mt-3">Changes to Terms</h4>
                <p>We reserve the right to modify these Terms at any time. Your continued use of our services following any changes constitutes your acceptance of those changes.</p>
                <Button variant="outline" className="mt-2">Read Full Terms</Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Refund and Cancellation Section */}
      <Collapsible open={refundOpen} onOpenChange={setRefundOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldOff size={18} />
                  <CardTitle className="text-lg">Refund and Cancellation</CardTitle>
                </div>
                <span className="text-gray-400 text-sm">Click to expand</span>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-3">
                <h4 className="font-medium">Cancellation Policy</h4>
                <p>You can cancel a subscription at any time. Cancellations will take effect from the next billing cycle.</p>
                <h4 className="font-medium mt-3">Refund Policy</h4>
                <p>If you're not satisfied with our products, you can request a refund within 7 days of delivery. Please contact our customer support team with your order details.</p>
                <h4 className="font-medium mt-3">Non-Refundable Items</h4>
                <p>Personalized or custom items cannot be refunded unless there's a manufacturing defect.</p>
                <Button variant="outline" className="mt-2">Read Full Policy</Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};

export default PolicySections;
