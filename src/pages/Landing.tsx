const Landing = () => {
  const downloadLink = "https://drive.google.com/uc?export=download&id=1GYJUbNp9GJuEBYpkF3IwMy6YxvSl8gvz";

  return (
    <div className="min-h-screen font-sans text-white selection:bg-purple-500 selection:text-white overflow-x-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 z-[-1]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{ 
            backgroundImage: `url('https://image2url.com/r2/default/images/1769696781505-18a8289d-34d3-48bb-9e8c-f8a0e2534e81.jpg')` 
          }}
        />
        {/* Deep Gradient Overlay to make Glassmorphism Pop */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-blue-900/70 to-purple-950/80 backdrop-blur-[4px]" />
      </div>

      {/* Hero Section */}
      <header className="relative pt-16 pb-12 px-6 flex flex-col items-center text-center max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase mb-8 shadow-xl">
          🚀 AI-Powered Medical Lab Technology Learning
        </div>
        
        <h1 className="text-4xl md:text-7xl font-extrabold leading-tight mb-6 drop-shadow-2xl">
          MLT Prep <br className="hidden md:block" /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-300">Exam Expert AI</span>
        </h1>
        
        <p className="text-base md:text-xl text-white/90 max-w-2xl mb-10 font-medium drop-shadow-md">
          DMLT, BMLT aur Government Lab Technician exams ki tayari ab hogi asaan. Practice Mock Tests & PYQs with AI.
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 mb-12">
          <div className="flex flex-col bg-white/5 p-4 rounded-2xl backdrop-blur-sm">
            <span className="text-2xl md:text-3xl font-bold">250+</span>
            <span className="text-white/60 text-xs md:text-sm uppercase tracking-tighter">Students</span>
          </div>
          <div className="flex flex-col bg-white/5 p-4 rounded-2xl backdrop-blur-sm">
            <span className="text-2xl md:text-3xl font-bold">5000+</span>
            <span className="text-white/60 text-xs md:text-sm uppercase tracking-tighter">MCQs</span>
          </div>
          <div className="flex flex-col col-span-2 md:col-span-1 bg-white/5 p-4 rounded-2xl backdrop-blur-sm">
            <span className="text-2xl md:text-3xl font-bold">95%</span>
            <span className="text-white/60 text-xs md:text-sm uppercase tracking-tighter">Results</span>
          </div>
        </div>

        {/* Offer Card */}
        <div className="relative w-full max-w-sm group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-purple-600 rounded-[24px] blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
          <div className="relative bg-white/10 backdrop-blur-3xl border border-white/30 rounded-[20px] p-8 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase shadow-lg">
              Save ₹97 Now
            </div>
            <div className="text-4xl font-black mb-1">₹399 <span className="text-sm font-normal text-white/70">/ 4 Months</span></div>
            <div className="text-green-400 text-xs font-bold mb-6 tracking-wide italic">₹99/month - Sabse Sasta aur Best!</div>
            
            <a href={downloadLink} className="block w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-black text-lg hover:scale-[1.03] active:scale-95 transition-all shadow-xl mb-4 uppercase tracking-tight">
              Get Started Now →
            </a>
            
            <p className="text-[10px] text-white/50 leading-relaxed uppercase tracking-widest">
              Direct Download • No Credit Card • 100% Secure
            </p>
          </div>
        </div>
      </header>

      {/* App Download Prompt Section (New) */}
      <section className="py-12 px-6 text-center">
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-lg">
           <h3 className="text-xl font-bold mb-4">Official Android App Download Karein</h3>
           <a href={downloadLink} className="inline-flex items-center gap-3 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors shadow-lg">
              <span className="text-xl">🤖</span> Download APK Now
           </a>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "AI Generated", icon: "🧠", desc: "Latest MLT pattern MCQs" },
            { title: "Exam PYQs", icon: "📖", desc: "Old papers by states/boards" },
            { title: "Full Mock", icon: "📋", desc: "Real-time exam feeling" },
            { title: "Analytics", icon: "📈", desc: "Identify your weak topics" },
          ].map((feature, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[20px] hover:border-white/40 transition-all">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold mb-1">{feature.title}</h3>
              <p className="text-white/60 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-16 drop-shadow-xl italic underline decoration-blue-500">Features Comparison</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="bg-black/20 backdrop-blur-lg border border-white/10 p-8 rounded-[25px]">
            <h3 className="text-xl font-bold mb-4 uppercase opacity-60">Free Plan</h3>
            <div className="text-4xl font-bold mb-8">₹0</div>
            <ul className="text-left space-y-5 text-sm mb-8 opacity-70">
              <li>✅ 1 Full Mock Test</li>
              <li>✅ Basic PYQ Set</li>
              <li className="line-through opacity-40 italic">❌ Rank & Leaderboard</li>
              <li className="line-through opacity-40 italic">❌ Detailed Analytics</li>
              <li className="line-through opacity-40 italic">❌ Unlimited Access</li>
            </ul>
          </div>

          <div className="bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-3xl border-2 border-yellow-500/50 p-10 rounded-[25px] relative shadow-[0_0_50px_rgba(234,179,8,0.15)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-black text-[11px] font-black px-6 py-2 rounded-full uppercase shadow-2xl animate-bounce">
              PREMIUM USER
            </div>
            <h3 className="text-xl font-bold mb-4 uppercase text-yellow-400">Premium Plan</h3>
            <div className="text-4xl font-bold mb-8">₹399 <span className="text-base font-normal opacity-60">/ 4 Months</span></div>
            <ul className="text-left space-y-5 text-sm mb-10">
              <li className="flex items-center gap-3">🔥 <span className="font-bold">Unlimited Mock Tests</span></li>
              <li className="flex items-center gap-3">🔥 <span className="font-bold">All Exam PYQs</span></li>
              <li className="flex items-center gap-3">🔥 <span className="font-bold">Real-time Rank System</span></li>
              <li className="flex items-center gap-3">🔥 <span className="font-bold">Weak Area Analysis</span></li>
              <li className="flex items-center gap-3">🔥 <span className="font-bold">Exclusive AI Support</span></li>
            </ul>
            <a href={downloadLink} className="block w-full py-5 bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-black text-xl rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl uppercase">
              Upgrade & Practice
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/80 backdrop-blur-2xl pt-20 pb-10 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
          <div>
            <h4 className="text-2xl font-black mb-6 tracking-tighter italic">MLT PREP</h4>
            <p className="text-white/50 leading-relaxed font-medium">
              India's #1 Platform for Medical Lab Technician Exam Prep. 
              Smarter preparation for a better career.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
             <div className="flex flex-col gap-4">
                <span className="font-bold text-white/40 uppercase tracking-widest text-[10px]">Links</span>
                <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
                <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
             </div>
             <div className="flex flex-col gap-4">
                <span className="font-bold text-white/40 uppercase tracking-widest text-[10px]">Resources</span>
                <a href={downloadLink} className="hover:text-blue-400 transition-colors">Download APK</a>
                <a href="#" className="hover:text-blue-400 transition-colors">DMLT Notes</a>
             </div>
          </div>
        </div>
        <div className="mt-20 text-center text-white/20 text-[10px] uppercase tracking-[5px] font-bold">
          © 2026 MLT Prep • Digital Education India
        </div>
      </footer>
    </div>
  );
};

export default Landing;
