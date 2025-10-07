import { motion } from "framer-motion";
import { Shield, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-white/70 text-lg mb-8">
            Last Updated: {new Date().toLocaleDateString('en-IN')}
          </p>

          <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Your Privacy Matters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-white/80">
              <section>
                <h3 className="text-white font-semibold text-xl mb-3">1. Introduction</h3>
                <p>
                  MLT Prep ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our educational platform. This policy complies with the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">2. Information We Collect</h3>
                
                <h4 className="text-white font-semibold mb-2">2.1 Personal Information</h4>
                <ul className="space-y-2 list-disc list-inside mb-4">
                  <li>Name and email address (for account creation)</li>
                  <li>Phone number (if provided)</li>
                  <li>Payment information (processed securely through third-party payment gateways)</li>
                  <li>Profile information (avatar, exam preparation details, state)</li>
                </ul>

                <h4 className="text-white font-semibold mb-2">2.2 Usage Information</h4>
                <ul className="space-y-2 list-disc list-inside mb-4">
                  <li>Test scores and performance data</li>
                  <li>Learning progress and activity logs</li>
                  <li>Time spent on the platform</li>
                  <li>Questions attempted and answers submitted</li>
                  <li>Subscription and payment history</li>
                </ul>

                <h4 className="text-white font-semibold mb-2">2.3 Technical Information</h4>
                <ul className="space-y-2 list-disc list-inside">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Access times and referring website addresses</li>
                </ul>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">3. How We Use Your Information</h3>
                <p className="mb-2">We use the collected information for:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Providing and maintaining our educational services</li>
                  <li>Processing payments and managing subscriptions</li>
                  <li>Personalizing your learning experience</li>
                  <li>Tracking your progress and generating performance analytics</li>
                  <li>Sending important updates, notifications, and promotional materials</li>
                  <li>Improving our platform and developing new features</li>
                  <li>Preventing fraud and ensuring platform security</li>
                  <li>Complying with legal obligations</li>
                </ul>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">4. Data Storage and Security</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Your data is stored on secure cloud servers</li>
                  <li>We implement industry-standard security measures including encryption</li>
                  <li>Payment information is processed through PCI-DSS compliant payment gateways</li>
                  <li>We do not store complete credit/debit card details on our servers</li>
                  <li>Access to personal data is restricted to authorized personnel only</li>
                  <li>We regularly review and update our security practices</li>
                </ul>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">5. Cookies and Tracking Technologies</h3>
                <p className="mb-2">We use cookies and similar technologies to:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Remember your login credentials and preferences</li>
                  <li>Analyze platform usage and improve user experience</li>
                  <li>Track performance and engagement metrics</li>
                  <li>Deliver personalized content and recommendations</li>
                </ul>
                <p className="mt-2">
                  You can control cookie settings through your browser, but disabling cookies may affect platform functionality.
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">6. Third-Party Services</h3>
                <p className="mb-2">We may share your information with:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li><strong>Payment Processors:</strong> To process subscription payments securely</li>
                  <li><strong>Analytics Providers:</strong> To understand platform usage and improve services</li>
                  <li><strong>Cloud Service Providers:</strong> For data storage and hosting</li>
                  <li><strong>Email Service Providers:</strong> To send notifications and updates</li>
                </ul>
                <p className="mt-2">
                  These third parties are contractually obligated to protect your data and use it only for specified purposes.
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">7. Data Retention</h3>
                <p>
                  We retain your personal information for as long as your account is active or as needed to provide services. If you request account deletion, we will delete or anonymize your data within 30 days, except where retention is required by law.
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">8. Your Rights</h3>
                <p className="mb-2">Under Indian law, you have the right to:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate or incomplete data</li>
                  <li>Request deletion of your account and data</li>
                  <li>Withdraw consent for data processing (where applicable)</li>
                  <li>Object to certain data processing activities</li>
                  <li>Request a copy of your data in a portable format</li>
                </ul>
                <p className="mt-2">
                  To exercise these rights, contact us at{" "}
                  <a href="mailto:ak6722909@gmail.com" className="text-blue-400 hover:text-blue-300 underline">
                    ak6722909@gmail.com
                  </a>
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">9. Children's Privacy</h3>
                <p>
                  Our platform is intended for users aged 16 and above. We do not knowingly collect personal information from children under 16. If we become aware of such collection, we will take steps to delete the information immediately.
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">10. Data Breach Notification</h3>
                <p>
                  In the event of a data breach that may compromise your personal information, we will notify affected users and relevant authorities as required by the IT Act, 2000 and applicable regulations.
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">11. International Data Transfers</h3>
                <p>
                  Your data may be transferred to and processed in countries outside India. We ensure that such transfers comply with applicable data protection laws and that adequate safeguards are in place.
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">12. Changes to Privacy Policy</h3>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on our platform and updating the "Last Updated" date. Your continued use after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">13. Grievance Officer</h3>
                <p>
                  In accordance with the IT Act, 2000 and rules made thereunder, the contact details of our Grievance Officer are:
                </p>
                <div className="mt-2 p-4 bg-white/5 rounded-lg">
                  <p><strong>Email:</strong> ak6722909@gmail.com</p>
                  <p><strong>Response Time:</strong> Within 48 hours of receiving a complaint</p>
                </div>
              </section>

              <section>
                <h3 className="text-white font-semibold text-xl mb-3">14. Contact Us</h3>
                <p>
                  For any questions or concerns about this Privacy Policy or our data practices, please contact us at:{" "}
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