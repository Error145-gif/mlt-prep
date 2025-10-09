import { motion } from "framer-motion";
import { XCircle, AlertTriangle, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function RefundPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 lg:p-8 relative">
      {/* Animated gradient background matching Landing page */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <motion.div
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-pink-400/40 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-cyan-400/40 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear",
            delay: 0.7,
          }}
        />
      </div>

      {/* Lab Background Image */}
      <div 
        className="fixed inset-0 opacity-10"
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
          <h1 className="text-4xl font-bold text-white mb-4">Cancellations and Refunds Policy</h1>
          <p className="text-white/70 text-lg mb-8">
            Last Updated: {new Date().toLocaleDateString('en-IN')}
          </p>

          <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-2">
                <XCircle className="h-6 w-6" />
                No Refunds Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-white/80">
              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-2">Important Notice</h3>
                  <p className="text-red-200">
                    All sales are final. MLT Prep does not offer refunds or cancellations for any subscriptions or purchases made on our platform.
                  </p>
                </div>
              </div>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">1. No Refund Policy</h3>
                <p className="mb-3">
                  Due to the digital nature of our services and immediate access provided upon purchase, we maintain a strict no-refund policy. Once you complete a payment and your subscription is activated, you will not be eligible for a refund under any circumstances.
                </p>
                <p>
                  This policy applies to all subscription plans including:
                </p>
                <ul className="space-y-2 list-disc list-inside mt-2">
                  <li>7-day free trial (if converted to paid)</li>
                  <li>Monthly subscription (₹99)</li>
                  <li>4-month subscription (₹399)</li>
                  <li>Yearly subscription (₹599)</li>
                </ul>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">2. Why No Refunds?</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li><strong>Instant Digital Access:</strong> All content and features are immediately accessible upon payment completion</li>
                  <li><strong>Digital Nature:</strong> Our services are 100% digital and cannot be "returned" once accessed</li>
                  <li><strong>Free Trial Available:</strong> We offer a 7-day free trial to help you evaluate our platform before committing to a paid subscription</li>
                  <li><strong>Transparent Pricing:</strong> All subscription details, features, and pricing are clearly displayed before purchase</li>
                </ul>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">3. No Cancellation Policy</h3>
                <p className="mb-3">
                  Once a subscription is purchased, it cannot be cancelled or terminated before the end of the subscription period. Your subscription will remain active for the entire duration you paid for.
                </p>
                <p>
                  For example:
                </p>
                <ul className="space-y-2 list-disc list-inside mt-2">
                  <li>If you purchase a monthly plan, you will have access for 30 days</li>
                  <li>If you purchase a 4-month plan, you will have access for 120 days</li>
                  <li>If you purchase a yearly plan, you will have access for 365 days</li>
                </ul>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">4. Before You Purchase</h3>
                <p className="mb-2">We strongly recommend that you:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Start with our 7-day free trial to explore the platform</li>
                  <li>Review all features and content available in your chosen plan</li>
                  <li>Read our Terms and Conditions carefully</li>
                  <li>Ensure you understand the subscription duration and pricing</li>
                  <li>Verify that our platform meets your learning needs</li>
                  <li>Contact our support team if you have any questions before purchasing</li>
                </ul>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">5. Technical Issues</h3>
                <p className="mb-3">
                  If you experience technical difficulties accessing the platform after payment, please contact our support team immediately at{" "}
                  <a href="mailto:ak6722909@gmail.com" className="text-blue-400 hover:text-blue-300 underline">
                    ak6722909@gmail.com
                  </a>
                </p>
                <p>
                  We will work to resolve technical issues promptly. However, technical difficulties do not qualify for refunds as they are typically resolvable through support.
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">6. Payment Errors</h3>
                <p>
                  In rare cases where you are charged multiple times for the same subscription due to a payment gateway error, please contact us within 7 days with proof of duplicate charges. We will investigate and process a refund for the duplicate charge only.
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">7. Account Termination</h3>
                <p>
                  If your account is terminated by MLT Prep due to violation of our Terms and Conditions, you will not be eligible for any refund of unused subscription time.
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">8. Subscription Renewal</h3>
                <p>
                  Currently, our subscriptions do not auto-renew. You will need to manually renew your subscription after it expires. No charges will be made without your explicit action.
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">9. Changes to This Policy</h3>
                <p>
                  We reserve the right to modify this Refund Policy at any time. Any changes will be posted on this page with an updated "Last Updated" date. Your continued use of the platform after changes constitutes acceptance of the modified policy.
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">10. Contact Us</h3>
                <p>
                  If you have any questions about this Refund Policy or need assistance, please contact us at:{" "}
                  <a href="mailto:ak6722909@gmail.com" className="text-blue-400 hover:text-blue-300 underline">
                    ak6722909@gmail.com
                  </a>
                </p>
              </section>

              <div className="pt-6 border-t border-white/20">
                <p className="text-white/60 text-sm italic">
                  By making a purchase on MLT Prep, you acknowledge that you have read, understood, and agree to this No Refunds and No Cancellations Policy.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}