"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ShippingPolicy;
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var react_router_1 = require("react-router");
function ShippingPolicy() {
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
      <div className="fixed inset-0 opacity-10" style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}/>
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Home Button */}
        <button_1.Button onClick={function () { return navigate("/"); }} variant="outline" className="glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white hover:bg-white/20">
          <lucide_react_1.Home className="h-4 w-4 mr-2"/>
          Back to Home
        </button_1.Button>

        <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold text-white mb-4">Shipping Policy</h1>
          <p className="text-white/70 text-lg mb-8">
            Last Updated: {new Date().toLocaleDateString('en-IN')}
          </p>

          <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <card_1.CardHeader>
              <card_1.CardTitle className="text-white text-2xl">Digital Services - No Physical Shipping</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-6 text-white/80">
              <div className="flex items-start gap-4">
                <lucide_react_1.Download className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1"/>
                <div>
                  <h3 className="text-white font-semibold mb-2">All Services Are Digital</h3>
                  <p>
                    MLT Prep is an educational platform that provides 100% digital services. All our offerings including mock tests, previous year question papers, AI-generated questions, study materials, and learning content are delivered electronically through our website and mobile application.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <lucide_react_1.Zap className="h-6 w-6 text-green-400 flex-shrink-0 mt-1"/>
                <div>
                  <h3 className="text-white font-semibold mb-2">Instant Access</h3>
                  <p>
                    Upon successful payment and subscription activation, you will receive immediate access to all subscribed features and content. There is no waiting period or shipping time involved.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <lucide_react_1.Package className="h-6 w-6 text-purple-400 flex-shrink-0 mt-1"/>
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
            </card_1.CardContent>
          </card_1.Card>
        </framer_motion_1.motion.div>
      </div>
    </div>);
}
