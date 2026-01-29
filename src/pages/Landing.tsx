const Landing = () => {
  return (
    <div className="min-h-screen font-sans text-white selection:bg-purple-500 selection:text-white">
      {/* Background Layer */}
      <div className="fixed inset-0 z-[-1]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1579154236594-e1797659584a?auto=format&fit=crop&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-blue-900/70 to-pink-900/60 backdrop-blur-[2px]" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      {/* Hero Section */}
      <header className="relative pt-20 pb-12 px-6 flex flex-col items-center text-center max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-8">
          AI-Powered Medical Lab Technology Learning
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          Medical Lab Technician (MLT) <br className="hidden md:block" /> Exam Preparation
        </h1>
        
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10 font-medium">
          Master DMLT, BMLT and Government Lab Technician Exams with AI-powered mock tests & PYQs.
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col">
            <span className="text-2xl font-bold">250+</span>
            <span className="text-white/60 text-sm">Active Students</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold">5000+</span>
            <span className="text-white/60 text-sm">Practice Questions</span>
          </div>
          <div className="flex flex-col col-span-2 md:col-span-1">
            <span className="text-2xl font-bold">95%</span>
            <span className="text-white/60 text-sm">Success Rate</span>
          </div>
        </div>

        {/* Offer Card */}
        <div className="relative w-full max-w-sm group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-rose-400 rounded-[24px] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-white/10 backdrop-blur-xl border-2 border-orange-400/30 rounded-[20px] p-8 shadow-2xl">
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-orange-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase">
              Most Popular
            </div>
            <div className="text-3xl font-bold mb-1">₹399 <span className="text-sm font-normal text-white/60">/ 4 Months</span></div>
            <div className="text-green-400 text-sm font-bold mb-6">SAVE ₹97 • Best Value ₹99/month</div>
            
            <a href="/dashboard" className="block w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-blue-900/20 mb-4">
              Go To Dashboard →
            </a>
            
            <p className="text-[10px] text-white/50 leading-relaxed uppercase tracking-tighter">
              No credit card required • Cancel anytime <br /> 100% Money-back guarantee
            </p>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "AI Questions", icon: "🧠", desc: "AI generated MCQs based on MLT exam pattern." },
            { title: "Medical PYQs", icon: "📖", desc: "Previous Year Questions organized by specific exams." },
            { title: "Mock Tests", icon: "📋", desc: "Full length mock tests to simulate real exam environments." },
            { title: "Track Progress", icon: "📊", desc: "Performance analytics and weak area identification." },
          ].map((feature, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-[20px] hover:bg-white/10 transition-colors">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-12">Why Upgrade to Premium?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Free Plan */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[20px] opacity-80">
            <h3 className="text-xl font-bold mb-4 uppercase tracking-widest">Free Plan</h3>
            <div className="text-4xl font-bold mb-8">₹0</div>
            <ul className="text-left space-y-4 text-sm mb-8">
              <li className="flex items-center gap-2">✅ 1 Mock Test</li>
              <li className="flex items-center gap-2">✅ 1 PYQ Set</li>
              <li className="flex items-center gap-2">✅ 1 AI Practice</li>
              <li className="flex items-center gap-2 text-white/30">❌ Full Analytics</li>
              <li className="flex items-center gap-2 text-white/30">❌ Rank System</li>
            </ul>
          </div>

          {/* Premium Plan */}
          <div className="bg-white/10 backdrop-blur-2xl border-2 border-yellow-500/30 p-10 rounded-[20px] relative shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase">
              Recommended
            </div>
            <h3 className="text-xl font-bold mb-4 uppercase tracking-widest">Premium Plan</h3>
            <div className="text-4xl font-bold mb-8">₹399 <span className="text-base text-white/50">/ 4m</span></div>
            <ul className="text-left space-y-4 text-sm mb-8">
              <li className="flex items-center gap-2">✨ Unlimited Mock Tests</li>
              <li className="flex items-center gap-2">✨ Unlimited PYQs</li>
              <li className="flex items-center gap-2">✨ Detailed Analytics</li>
              <li className="flex items-center gap-2">✨ Rank & Leaderboard</li>
              <li className="flex items-center gap-2">✨ Weak Area Analysis</li>
            </ul>
            <a href="#" className="block w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl font-extrabold hover:brightness-110 transition-all">
              Upgrade Now - Save ₹97
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 p-12 rounded-[30px] text-center shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-white/70 mb-10 max-w-md mx-auto">Join thousands of students preparing smarter for India's top medical laboratory exams.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/start" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold">
              Start Learning
            </a>
            <a href="https://play.google.com" className="px-8 py-4 bg-white/10 border border-white/20 hover:bg-white/20 rounded-xl font-bold transition-all">
              Download App
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-md pt-16 pb-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
          <div>
            <h4 className="text-lg font-bold mb-4 tracking-tighter uppercase">MLT Prep</h4>
            <p className="text-white/50 leading-relaxed">
              India's leading exam preparation platform for medical lab technicians. 
              Empowering future healthcare professionals with advanced AI tools.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-[10px] tracking-[2px]">Quick Links</h4>
            <nav className="flex flex-col gap-3 text-white/60">
              <a href="#" className="hover:text-white transition-colors">Contact Us</a>
              <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            </nav>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-[10px] tracking-[2px]">Medical Lab Exams</h4>
            <nav className="flex flex-col gap-3 text-white/60">
              <a href="#" className="hover:text-white transition-colors">MLT Exam</a>
              <a href="#" className="hover:text-white transition-colors">Lab Technician Exam</a>
              <a href="#" className="hover:text-white transition-colors">DMLT Course</a>
            </nav>
          </div>
        </div>
        <div className="mt-16 text-center text-white/30 text-[10px] uppercase tracking-[3px]">
          © 2026 MLT Prep. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
