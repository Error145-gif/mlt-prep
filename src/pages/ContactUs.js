"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ContactUs;
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var react_router_1 = require("react-router");
function ContactUs() {
    var navigate = (0, react_router_1.useNavigate)();
    return (<div className="min-h-screen p-6 lg:p-8 relative">
      {/* Animated gradient background matching Landing page */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <framer_motion_1.motion.div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl" animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
        }} transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
        }}/>
        <framer_motion_1.motion.div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl" animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
        }} transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 1,
        }}/>
        <framer_motion_1.motion.div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-pink-400/40 rounded-full blur-3xl" animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
        }} transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5,
        }}/>
        <framer_motion_1.motion.div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-cyan-400/40 rounded-full blur-3xl" animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
        }} transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear",
            delay: 0.7,
        }}/>
      </div>

      {/* Lab Background Image */}
      <div className="fixed inset-0 opacity-15" style={{
            backgroundImage: 'url(https://harmless-tapir-303.convex.cloud/api/storage/0e53265d-8c31-44c1-b791-3be9b7cd1490)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
        }}/>
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Home Button */}
        <button_1.Button onClick={function () { return navigate("/"); }} variant="outline" className="glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white hover:bg-white/20">
          <lucide_react_1.Home className="h-4 w-4 mr-2"/>
          Back to Home
        </button_1.Button>

        <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-white/70 text-lg mb-8">
            We're here to help! Reach out to us for any questions, support, or feedback.
          </p>

          <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <card_1.CardHeader>
              <card_1.CardTitle className="text-white text-2xl">Get in Touch</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <lucide_react_1.Send className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1"/>
                <div>
                  <h3 className="text-white font-semibold mb-1">🎓 The Hub for MLT Students</h3>
                  <p className="text-white/70 mb-2">
                    Join our Telegram community to share your problems and doubts, and discuss topics with fellow students:
                  </p>
                  <a href="https://t.me/MLT_prep" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                    <lucide_react_1.Send className="h-4 w-4"/>
                    Join Telegram Group
                  </a>
                  <p className="text-white/60 text-sm mt-2">
                    Connect with other MLT students, get instant support, and collaborate on your exam preparation.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <lucide_react_1.Mail className="h-6 w-6 text-green-400 flex-shrink-0 mt-1"/>
                <div>
                  <h3 className="text-white font-semibold mb-1">Email Support</h3>
                  <p className="text-white/70 mb-2">
                    For any queries, technical support, or feedback, please email us at:
                  </p>
                  <a href="mailto:ak6722909@gmail.com" className="text-green-400 hover:text-green-300 underline">
                    ak6722909@gmail.com
                  </a>
                  <p className="text-white/60 text-sm mt-2">
                    We typically respond within 24-48 hours during business days.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <lucide_react_1.MapPin className="h-6 w-6 text-orange-400 flex-shrink-0 mt-1"/>
                <div>
                  <h3 className="text-white font-semibold mb-1">Location</h3>
                  <p className="text-white/70">
                    MLT Prep<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <lucide_react_1.Phone className="h-6 w-6 text-purple-400 flex-shrink-0 mt-1"/>
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
            </card_1.CardContent>
          </card_1.Card>
        </framer_motion_1.motion.div>
      </div>
    </div>);
}
