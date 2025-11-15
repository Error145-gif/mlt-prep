// @ts-nocheck
import { motion } from "framer-motion";
import { FileText, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function TermsAndConditions() {
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
          <h1 className="text-4xl font-bold text-white mb-4">Terms and Conditions</h1>
          <p className="text-white/70 text-lg mb-8">
            Last Updated: {new Date().toLocaleDateString('en-IN')}
          </p>

          <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Terms of Service
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-white/80">
              <section>
                <h3 className="text-white font-semibold text-xl mb-3">1. Acceptance of Terms</h3>
                <p>
                  By accessing and using MLT Prep ("the Platform"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">2. User Account</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>You must create an account to access our services</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You must provide accurate and complete information during registration</li>
                  <li>You are responsible for all activities that occur under your account</li>
                  <li>You must notify us immediately of any unauthorized use of your account</li>
                  <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
                </ul>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">3. Intellectual Property Rights</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>All content on MLT Prep, including text, graphics, logos, images, videos, and software, is the property of MLT Prep or its content suppliers</li>
                  <li>Content is protected by Indian and international copyright laws</li>
                  <li>You may not reproduce, distribute, modify, or create derivative works without our written permission</li>
                  <li>Downloaded content is for personal, non-commercial use only</li>
                  <li>Sharing account credentials or content with others is strictly prohibited</li>
                </ul>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">4. Prohibited Uses</h3>
                <p className="mb-2">You agree not to:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Use the Platform for any unlawful purpose</li>
                  <li>Attempt to gain unauthorized access to any portion of the Platform</li>
                  <li>Interfere with or disrupt the Platform or servers</li>
                  <li>Upload viruses or malicious code</li>
                  <li>Scrape, copy, or download content using automated means</li>
                  <li>Impersonate any person or entity</li>
                  <li>Share or resell access to the Platform</li>
                  <li>Use the Platform to harass, abuse, or harm others</li>
                </ul>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">5. Subscription and Payment</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Subscription fees are charged in Indian Rupees (INR)</li>
                  <li>Payment must be made through our authorized payment gateways</li>
                  <li>Subscriptions are non-transferable</li>
                  <li>We reserve the right to change pricing with prior notice</li>
                  <li>All sales are final - no refunds or cancellations (see Refund Policy)</li>
                </ul>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">6. Content Accuracy</h3>
                <p>
                  While we strive to provide accurate and up-to-date content, we do not guarantee the accuracy, completeness, or reliability of any content on the Platform. Use of the content is at your own risk.
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">7. Limitation of Liability</h3>
                <p>
                  To the maximum extent permitted by Indian law, MLT Prep shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
                </p>
                <ul className="space-y-2 list-disc list-inside mt-2">
                  <li>Your use or inability to use the Platform</li>
                  <li>Any unauthorized access to or use of our servers</li>
                  <li>Any interruption or cessation of transmission to or from the Platform</li>
                  <li>Any bugs, viruses, or similar that may be transmitted through the Platform</li>
                  <li>Any errors or omissions in any content</li>
                </ul>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">8. Disclaimer of Warranties</h3>
                <p>
                  The Platform is provided on an "AS IS" and "AS AVAILABLE" basis without any warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">9. Indemnification</h3>
                <p>
                  You agree to indemnify and hold harmless MLT Prep, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising out of your use of the Platform or violation of these Terms.
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">10. Termination</h3>
                <p>
                  We reserve the right to terminate or suspend your account and access to the Platform immediately, without prior notice, for any reason, including breach of these Terms.
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">11. Governing Law and Jurisdiction</h3>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or relating to these Terms or the Platform shall be subject to the exclusive jurisdiction of the courts in India.
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">12. Changes to Terms</h3>
                <p>
                  We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on the Platform. Your continued use of the Platform after such changes constitutes acceptance of the modified Terms.
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">13. Contact Information</h3>
                <p>
                  For any questions regarding these Terms, please contact us at:{" "}
                  <a href="mailto:ak6722909@gmail.com" className="text-blue-400 hover:text-blue-300 underline">
                    ak6722909@gmail.com
                  </a>
                </p>
              </section>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}