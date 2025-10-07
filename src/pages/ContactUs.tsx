import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactUs() {
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-white/70 text-lg mb-8">
            We're here to help! Reach out to us for any questions, support, or feedback.
          </p>

          <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Email Support</h3>
                  <p className="text-white/70 mb-2">
                    For any queries, technical support, or feedback, please email us at:
                  </p>
                  <a 
                    href="mailto:ak6722909@gmail.com" 
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    ak6722909@gmail.com
                  </a>
                  <p className="text-white/60 text-sm mt-2">
                    We typically respond within 24-48 hours during business days.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Location</h3>
                  <p className="text-white/70">
                    MLT Prep<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Support Hours</h3>
                  <p className="text-white/70">
                    Monday - Saturday: 9:00 AM - 6:00 PM IST<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/20">
                <h3 className="text-white font-semibold mb-3">What We Can Help With:</h3>
                <ul className="space-y-2 text-white/70">
                  <li>• Technical issues with the app or website</li>
                  <li>• Questions about subscriptions and payments</li>
                  <li>• Content-related queries</li>
                  <li>• Account management assistance</li>
                  <li>• Feedback and suggestions</li>
                  <li>• Report bugs or errors</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
