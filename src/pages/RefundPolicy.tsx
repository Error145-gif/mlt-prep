// @ts-nocheck
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, Home, Shield } from "lucide-react";
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
          <h1 className="text-4xl font-bold text-white mb-4">Refund & Cancellation Policy</h1>
          <p className="text-white/70 text-lg mb-8">
            Last Updated: {new Date().toLocaleDateString('en-IN')}
          </p>

          {/* 7-Day Money-Back Guarantee */}
          <Card className="glass-card border-green-500/30 backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 mb-6">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-2">
                <Shield className="h-6 w-6 text-green-400" />
                7-Day Money-Back Guarantee
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-white/90">
              <div className="flex items-start gap-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-2">100% Risk-Free Trial</h3>
                  <p className="text-green-100">
                    We're confident you'll love MLT Prep! If you're not satisfied within the first 7 days of your subscription, we'll refund your full payment—no questions asked.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-white font-semibold">How It Works:</h4>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Purchase any subscription plan (Monthly, 4-Month, or Yearly)</li>
                  <li>Try all features: Mock Tests, PYQs, AI Questions, Analytics</li>
                  <li>If not satisfied, email us within 7 days at{" "}
                    <a href="mailto:ak6722909@gmail.com" className="text-blue-300 hover:text-blue-200 underline">
                      ak6722909@gmail.com
                    </a>
                  </li>
                  <li>Get 100% refund within 5-7 business days</li>
                </ul>
              </div>

              <div className="bg-white/10 rounded-lg p-3 mt-4">
                <p className="text-sm text-white/90">
                  <strong>Note:</strong> This guarantee applies only to first-time purchases. Renewals and repeat purchases are non-refundable.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Complete Refund Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-white/80">
              <section>
                <h3 className="text-white font-semibold text-xl mb-3">1. Eligibility for Refunds</h3>
                <p className="mb-3">
                  You are eligible for a full refund if:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li><strong>First-Time Purchase:</strong> This is your first subscription purchase on MLT Prep</li>
                  <li><strong>Within 7 Days:</strong> You request a refund within 7 days of payment</li>
                  <li><strong>Valid Reason:</strong> You provide a genuine reason (technical issues, content not as expected, etc.)</li>
                  <li><strong>No Abuse:</strong> You haven't violated our Terms of Service</li>
                </ul>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">2. Non-Refundable Situations</h3>
                <p className="mb-3">
                  Refunds will NOT be provided in the following cases:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li><strong>After 7 Days:</strong> Refund requests made after 7 days of purchase</li>
                  <li><strong>Repeat Purchases:</strong> Second or subsequent subscription purchases</li>
                  <li><strong>Renewals:</strong> Subscription renewals are non-refundable</li>
                  <li><strong>Partial Refunds:</strong> We don't offer pro-rated or partial refunds</li>
                  <li><strong>Account Violations:</strong> If your account was terminated for violating Terms of Service</li>
                  <li><strong>Change of Mind:</strong> After the 7-day guarantee period has expired</li>
                </ul>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">3. How to Request a Refund</h3>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="mb-3">To request a refund within 7 days:</p>
                  <ol className="space-y-2 list-decimal list-inside">
                    <li>Email us at{" "}
                      <a href="mailto:ak6722909@gmail.com" className="text-blue-300 hover:text-blue-200 underline">
                        ak6722909@gmail.com
                      </a>
                    </li>
                    <li>Subject: "Refund Request - [Your Email]"</li>
                    <li>Include: Order ID, Payment Date, Reason for refund</li>
                    <li>We'll process your request within 24-48 hours</li>
                    <li>Refund will be credited within 5-7 business days</li>
                  </ol>
                </div>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">4. Free Trial - Try Before You Buy</h3>
                <p className="mb-3">
                  We strongly encourage you to use our <strong>free trial</strong> before purchasing:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>1 Mock Test (free)</li>
                  <li>1 PYQ Set (free)</li>
                  <li>1 AI Practice Session (free)</li>
                  <li>Weekly Tests (always free for all users)</li>
                </ul>
                <p className="mt-3 text-white/90">
                  This allows you to evaluate the platform before committing to a paid subscription.
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">5. Cancellation Policy</h3>
                <p className="mb-3">
                  <strong>No Auto-Renewal:</strong> Our subscriptions do NOT auto-renew. You will need to manually renew after expiry.
                </p>
                <p className="mb-3">
                  <strong>Mid-Term Cancellation:</strong> If you wish to stop using the platform mid-subscription, you can simply not renew. However, no refunds will be provided for unused time after the 7-day guarantee period.
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">6. Technical Issues</h3>
                <p className="mb-3">
                  If you experience technical difficulties accessing the platform:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Contact support immediately at{" "}
                    <a href="mailto:ak6722909@gmail.com" className="text-blue-300 hover:text-blue-200 underline">
                      ak6722909@gmail.com
                    </a>
                  </li>
                  <li>We'll work to resolve issues within 24-48 hours</li>
                  <li>If unresolved within 7 days, you're eligible for a full refund</li>
                </ul>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">7. Payment Errors & Duplicate Charges</h3>
                <p className="mb-3">
                  If you're charged multiple times due to a payment gateway error:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Contact us within 7 days with proof of duplicate charges</li>
                  <li>We'll investigate and refund duplicate charges immediately</li>
                  <li>Original subscription charge remains valid</li>
                </ul>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">8. Refund Processing Time</h3>
                <p className="mb-3">
                  Once approved, refunds are processed as follows:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li><strong>UPI/Debit Card:</strong> 5-7 business days</li>
                  <li><strong>Credit Card:</strong> 7-10 business days</li>
                  <li><strong>Net Banking:</strong> 5-7 business days</li>
                </ul>
                <p className="mt-3 text-white/90">
                  Refund timelines depend on your bank/payment provider.
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">9. Contact Us</h3>
                <p>
                  For any refund-related queries, contact us at:{" "}
                  <a href="mailto:ak6722909@gmail.com" className="text-blue-300 hover:text-blue-200 underline">
                    ak6722909@gmail.com
                  </a>
                </p>
                <p className="mt-2 text-white/90">
                  We typically respond within 24 hours.
                </p>
              </section>

              <div className="pt-6 border-t border-white/20">
                <p className="text-white/60 text-sm italic">
                  By making a purchase on MLT Prep, you acknowledge that you have read, understood, and agree to this Refund & Cancellation Policy.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}