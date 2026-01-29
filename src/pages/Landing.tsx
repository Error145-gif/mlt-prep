const Landing = () => {
  return (
    <div className="min-h-screen font-sans text-white selection:bg-purple-500 selection:text-white overflow-x-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 z-[-1]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url('https://image2url.com/r2/default/images/1769696781505-18a8289d-34d3-48bb-9e8c-f8a0e2534e81.jpg')` 
          }}
        />
        {/* Gradient Overlay for Glassmorphism readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-blue-900/70 to-pink-900/60 backdrop-blur-[3px]" />
      </div>

      {/* Hero Section */}
      <header className="relative pt-16 pb-12 px-6 flex flex-col items-center text-center max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-[10px] md:text-xs font-bold tracking-wider uppercase mb-8 shadow-lg">
          ✨ AI-Powered Medical Lab Technology Learning
        </div>
        
        <h1 className="text-3xl md:text-6xl font-bold leading-tight mb-6 drop-shadow-lg">
          Medical Lab Technician (MLT) <br className="hidden md:block" /> Exam Preparation
        </h1>
        
        <p className="text-base md:text-xl text-white/90 max-w-2xl mb-10 font-medium drop-shadow-md">
          Master DMLT, BMLT and Government Lab Technician Exams with AI-powered mock tests & PYQs.
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 mb-12">
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl font-bold">250+</span>
            <span className="text-white/70 text-xs md:text-sm">Active Students</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl font-bold">5000+</span>
            <span className="text-white/70 text-xs md:text-sm">Practice Questions</span>
          </div>
          <div className="flex flex-col col-span-2 md:col-span-1">
            <span className="text-2xl md:text-3xl font-bold">95%</span>
            <span className="text-white/70 text-xs md:text-sm">Success Rate</span>
          </div>
        </div>

        {/* Offer Card */}
        <div className="relative w-full max-w-sm group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-rose-400 rounded-[24px] blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
          <div className="relative bg-white/15 backdrop-blur-2xl border border-white/30 rounded-[20px] p-8 shadow-2xl">
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-orange-500 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase shadow-lg">
              Most Popular
            </div>
            <div className="text-4xl font-bold mb-1">₹399 <span className="text-sm font-normal text-white/70">/ 4 Months</span></div>
            <div className="text-green-300 text-sm font-bold mb-6">SAVE ₹97 • Best Value ₹99/month</div>
            
            <a href="https://your-dashboard-link.com" className="block w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold hover:scale-[1.03] active:scale-95 transition-all shadow-xl mb-4">
              Go To Dashboard →
            </a>
            
            <p className="text-[10px] text-white/60 leading-relaxed uppercase tracking-widest">
              No credit card required • 100% Money-back
            </p>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "AI Questions", icon: "🧠", desc: "AI generated MCQs based on MLT exam pattern." },
            { title: "Medical PYQs", icon: "📖", desc: "Previous Year Questions organized by specific exams." },
            { title: "Mock Tests", icon: "📋", desc: "Full length mock tests to simulate real exams." },
            { title: "Track Progress", icon: "📊", desc: "Performance analytics and weak area identification." },
          ].map((feature, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-[20px] hover:bg-white/20 transition-all cursor-default">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 drop-shadow-lg">Why Upgrade to Premium?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Free Plan */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-[20px]">
            <h3 className="text-xl font-bold mb-4 uppercase opacity-80">Free Plan</h3>
            <div className="text-4xl font-bold mb-8">₹0</div>
            <ul className="text-left space-y-4 text-sm mb-8">
              <li className="flex items-center gap-2">✅ 1 Mock Test</li>
              <li className="flex items-center gap-2">✅ 1 PYQ Set</li>
              <li className="flex items-center gap-2 opacity-40">❌ Full Analytics</li>
              <li className="flex items-center gap-2 opacity-40">❌ Rank System</li>
            </ul>
          </div>

          {/* Premium Plan */}
          <div className="bg-white/20 backdrop-blur-3xl border-2 border-yellow-500/40 p-10 rounded-[20px] relative shadow-[0_0_40px_rgba(234,179,8,0.2)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-black text-[10px] font-black px-6 py-1.5 rounded-full uppercase shadow-md">
              Recommended
            </div>
            <h3 className="text-xl font-bold mb-4 uppercase tracking-widest text-yellow-400">Premium Plan</h3>
            <div className="text-4xl font-bold mb-8 text-white">₹399 <span className="text-base font-normal opacity-60">/ 4m</span></div>
            <ul className="text-left space-y-4 text-sm mb-8">
              <li className="flex items-center gap-2">✨ Unlimited Mock Tests</li>
              <li className="flex items-center gap-2">✨ Unlimited PYQs</li>
              <li className="flex items-center gap-2">✨ Detailed Analytics</li>
              <li className="flex items-center gap-2">✨ Rank & Leaderboard</li>
            </ul>
            <a href="#" className="block w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl font-extrabold hover:brightness-110 active:scale-95 transition-all shadow-lg">
              Upgrade Now
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 p-8 md:p-12 rounded-[30px] text-center shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-white/80 mb-10 max-w-md mx-auto">Join thousands of students preparing smarter for India's top medical laboratory exams.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#" className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold hover:scale-105 transition-transform">
              Start Learning
            </a>
            <a href="https://play.google.com" className="px-10 py-4 bg-white/10 border border-white/20 hover:bg-white/20 rounded-xl font-bold transition-all">
              Download App
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/60 backdrop-blur-xl pt-16 pb-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
          <div>
            <h4 className="text-lg font-bold mb-4">MLT Prep</h4>
            <p className="text-white/50 leading-relaxed">
              India's leading exam preparation platform for medical lab technicians. 
              Empowering future healthcare professionals.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-[10px] tracking-widest opacity-60">Quick Links</h4>
            <nav className="flex flex-col gap-3 text-white/60">
              <a href="#" className="hover:text-white transition-colors">Contact Us</a>
              <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            </nav>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-[10px] tracking-widest opacity-60">Exams</h4>
            <nav className="flex flex-col gap-3 text-white/60">
              <a href="#" className="hover:text-white transition-colors">DMLT Course</a>
              <a href="#" className="hover:text-white transition-colors">BMLT Prep</a>
              <a href="#" className="hover:text-white transition-colors">Lab Assistant</a>
            </nav>
          </div>
        </div>
        <div className="mt-16 text-center text-white/30 text-[10px] uppercase tracking-widest">
          © 2026 MLT Prep. Crafted for Excellence.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
