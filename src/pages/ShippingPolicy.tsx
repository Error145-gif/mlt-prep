import { motion } from "framer-motion";
import { Package, Download, Zap, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function ShippingPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 lg:p-8 relative">
      {/* Lab Background Image */}
      <div 
        className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Home Button */}
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white hover:bg-white/20"
        >
          <Home className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">Shipping Policy</h1>
          <p className="text-white/70 text-lg mb-8">
            Last Updated: {new Date().toLocaleDateString('en-IN')}
          </p>

          <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Digital Services - No Physical Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-white/80">
              <div className="flex items-start gap-4">
                <Download className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-2">All Services Are Digital</h3>
                  <p>
                    MLT Prep is an educational platform that provides 100% digital services. All our offerings including mock tests, previous year question papers, AI-generated questions, study materials, and learning content are delivered electronically through our website and mobile application.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Zap className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-2">Instant Access</h3>
                  <p>
                    Upon successful payment and subscription activation, you will receive immediate access to all subscribed features and content. There is no waiting period or shipping time involved.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Package className="h-6 w-6 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-2">No Physical Products</h3>
                  <p>
                    We do not sell, ship, or deliver any physical products, books, or materials. All content is accessible online through your registered account on our platform.
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/20">
                <h3 className="text-white font-semibold mb-3">How to Access Your Content:</h3>
                <ol className="space-y-2 list-decimal list-inside">
                  <li>Complete your payment through our secure payment gateway</li>
                  <li>Your subscription will be activated immediately</li>
                  <li>Log in to your account on our website or mobile app</li>
                  <li>Access all subscribed content instantly from your dashboard</li>
                </ol>
              </div>

              <div className="pt-6 border-t border-white/20">
                <h3 className="text-white font-semibold mb-3">Technical Support:</h3>
                <p>
                  If you face any issues accessing your content after payment, please contact our support team at{" "}
                  <a href="mailto:ak6722909@gmail.com" className="text-blue-400 hover:text-blue-300 underline">
                    ak6722909@gmail.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}