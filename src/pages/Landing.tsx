const Landing = () => {
  const downloadLink = "https://drive.google.com/uc?export=download&id=1GYJUbNp9GJuEBYpkF3IwMy6YxvSl8gvz";

  return (
    <div className="min-h-screen font-sans text-white selection:bg-purple-500 overflow-x-hidden">
      {/* Background Layer - Exact image as requested */}
      <div className="fixed inset-0 z-[-1]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url('https://image2url.com/r2/default/images/1769696781505-18a8289d-34d3-48bb-9e8c-f8a0e2534e81.jpg')` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800/70 via-blue-900/80 to-pink-800/70 backdrop-blur-[2px]" />
      </div>

      {/* 1. Header & Hero Section */}
      <header className="relative pt-6 pb-8 px-6 flex flex-col items-center text-center max-w-4xl mx-auto">
        <nav className="w-full flex justify-between items-center mb-12">
           <div className="flex items-center gap-2">
              <img src="https://image2url.com/r2/default/images/mlt-logo.png" alt="MLT Logo" className="w-8 h-8 rounded" />
              <span className="font-bold text-lg">MLT Prep</span>
           </div>
           <div className="flex gap-4">
              <a href="/dashboard" className="bg-blue-600 px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg">
                Dashboard
              </a>
              <div className="p-2 bg-white/10 rounded-lg">🚀</div>
           </div>
        </nav>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-[10px] md:text-xs font-medium mb-8 flex items-center gap-2">
          <span>✨</span> AI-Powered Medical Lab Technology Learning
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 drop-shadow-lg">
          Medical Lab Technician (MLT) Exam Preparation with <span className="text-blue-300 font-extrabold uppercase italic">AI-Powered Mock Tests & PYQs</span>
        </h1>
        
        <p className="text-sm md:text-base text-white/80 max-w-2xl mb-10 leading-relaxed font-medium">
          Complete Medical Lab Technician (MLT) Exam preparation for DMLT, BMLT, and Lab Technician Govt Exam with comprehensive MLT Mock Tests, Medical Lab PYQs, and AI-generated Medical Lab MCQs.
        </p>

        {/* Stats Row */}
        <div className="flex justify-around w-full max-w-2xl mb-12">
          <div className="flex flex-col">
            <span className="text-3xl font-black italic">250+</span>
            <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Active Students</span>
          </div>
          <div className="flex flex-col border-x border-white/10 px-8">
            <span className="text-3xl font-black italic">5000+</span>
            <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Practice Questions</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-black italic">95%</span>
            <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Success Rate</span>
          </div>
        </div>

        {/* Extra Chiz: Android Download Button (Prominent) */}
        <div className="w-full max-w-sm mb-12">
           <a href={downloadLink} className="flex items-center justify-center gap-3 w-full py-4 bg-white text-black rounded-2xl font-black text-lg hover:bg-gray-200 transition-all shadow-2xl active:scale-95">
             <span className="text-2xl">🤖</span> Download Android App Now
           </a>
        </div>

        {/* Offer Card (Exact Image 1 style) */}
        <div className="relative w-full max-w-md bg-white/10 backdrop-blur-3xl border border-white/30 rounded-[28px] p-6 shadow-2xl overflow-hidden mb-12">
           <div className="flex justify-between items-start mb-6">
              <div className="text-left">
                <span className="text-orange-400 text-xs font-bold flex items-center gap-1">🔥 Limited Time Offer</span>
                <div className="text-4xl font-black tracking-tight">₹399 <span className="text-lg font-normal">for 4 Months</span></div>
                <div className="text-white/50 text-xs line-through mt-1 italic">Regular: ₹496</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                 <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl shadow-lg uppercase">MOST POPULAR</span>
                 <span className="bg-red-700/80 text-white text-[10px] font-bold px-3 py-1 rounded-lg">SAVE ₹97 • 20% OFF</span>
                 <div className="text-yellow-400 text-[11px] font-black italic mt-2">⭐ Best Value Just ₹99/month</div>
              </div>
           </div>
           
           <a href="/dashboard" className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl font-black text-xl hover:scale-[1.02] transition-transform shadow-lg mb-6">
             Go to Dashboard →
           </a>
           
           <div className="text-[12px] font-medium text-white/80 space-y-2 border-t border-white/10 pt-4">
              <p>✓ No credit card required • ✓ Cancel anytime</p>
              <p className="text-white font-bold tracking-tight">🎁 100% Money-back guarantee - <span className="text-yellow-400 uppercase">Risk FREE!</span></p>
           </div>
           
           <div className="mt-4 flex justify-center gap-4 text-[10px] font-bold opacity-60">
              <span>⏰ Offer expires in 48 hours</span>
              <span>🎯 Join 250+ students</span>
           </div>
        </div>
      </header>

      {/* 3. Everything You Need Section */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight drop-shadow-lg">Everything You Need to Succeed</h2>
        <p className="text-white/60 text-sm mb-12 max-w-xl mx-auto font-medium">Comprehensive preparation tools for DMLT, BMLT, and government lab technician exams</p>

        <div className="space-y-4">
          {[
            { title: "AI-Powered Medical Lab Questions", icon: "🧠", desc: "Practice with AI-generated Medical Lab MCQs tailored to MLT Exam and Lab Technician Exam patterns" },
            { title: "Medical Lab PYQs", icon: "📖", desc: "Access comprehensive Medical Lab PYQs and MLT Previous Year Questions organized by exam and year" },
            { title: "MLT Mock Tests", icon: "🏅", desc: "Take full-length MLT Mock Tests and Lab Technician Govt Exam practice tests to simulate real exam conditions" },
            { title: "Track Medical Lab Tech Progress", icon: "📈", desc: "Monitor your Medical Lab Technician Exam performance with detailed analytics and rankings" },
          ].map((item, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-[26px] flex items-center gap-6 text-left hover:bg-white/15 transition-all">
              <div className="bg-purple-600/30 p-4 rounded-2xl text-3xl shadow-inner">{item.icon}</div>
              <div>
                <h3 className="font-black text-lg mb-1 tracking-tight">{item.title}</h3>
                <p className="text-white/50 text-[13px] leading-relaxed font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Pricing Comparison Section */}
      <section className="py-20 px-6 max-w-md mx-auto">
        <div className="text-center mb-12">
            <span className="bg-red-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-lg">⚡ LIMITED TIME: Save ₹97 Today Only!</span>
            <h2 className="text-3xl font-black mt-6 mb-2 tracking-tighter italic uppercase underline decoration-blue-500 underline-offset-8">Why Upgrade to Premium?</h2>
            <p className="text-white/50 text-xs">See what you're missing with the free plan</p>
        </div>

        {/* Free Plan Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[30px] p-8 mb-10 opacity-70">
          <h3 className="text-2xl font-black mb-6 uppercase tracking-widest text-center">Free Plan</h3>
          <ul className="space-y-4 text-[13px] font-bold">
            <li className="flex items-center gap-3">✅ 1 Mock Test only</li>
            <li className="flex items-center gap-3">✅ 1 PYQ Set only</li>
            <li className="flex items-center gap-3">✅ 1 AI Practice only</li>
            <li className="flex items-center gap-3 text-white/30 italic">❌ Detailed Analytics</li>
            <li className="flex items-center gap-3 text-white/30 italic">❌ Rank & Leaderboard</li>
            <li className="flex items-center gap-3 text-white/30 italic">❌ Weak Area Analysis</li>
          </ul>
        </div>

        {/* Premium Plan Card (Image 5 Style) */}
        <div className="bg-white/20 backdrop-blur-3xl border-2 border-yellow-500/50 rounded-[30px] p-10 text-center shadow-[0_0_60px_rgba(234,179,8,0.2)] relative">
          <div className="bg-yellow-500 text-black text-[11px] font-black px-6 py-2 rounded-full absolute -top-4 left-1/2 -translate-x-1/2 shadow-xl animate-pulse">MOST POPULAR</div>
          <h2 className="text-3xl font-black mb-1 italic tracking-tighter">Premium Plan</h2>
          <p className="text-white/70 text-sm mb-8 font-bold italic tracking-wide">Full Access - ₹399/4 months</p>

          <ul className="text-left space-y-5 mb-10 text-[13px] font-black uppercase tracking-tight">
            {["Unlimited Mock Tests", "All PYQ Sets with Solutions", "Unlimited AI Practice", "Detailed Performance Analytics", "Rank & Leaderboard Access", "Topic-wise Weak Area Analysis"].map((list, i) => (
              <li key={i} className="flex items-center gap-4">
                <span className="text-green-400 text-xl font-bold italic">✓</span> {list}
              </li>
            ))}
          </ul>

          <a href="/upgrade" className="block w-full py-5 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl font-black text-xl text-white shadow-2xl hover:brightness-110 active:scale-95 transition-all">
            🔥 Upgrade Now - Save ₹97 →
          </a>
        </div>
      </section>

      {/* 6. CTA Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 p-12 rounded-[40px] text-center shadow-2xl">
          <h2 className="text-3xl font-black mb-4 tracking-tighter italic">Ready to Start Your Journey?</h2>
          <p className="text-white/70 mb-10 max-w-md mx-auto font-medium leading-relaxed italic">Join thousands of students preparing for DMLT, BMLT, and government lab technician exams with our comprehensive platform</p>
          <a href="/register" className="inline-flex items-center justify-center gap-3 px-12 py-5 bg-blue-600 rounded-2xl font-black text-xl hover:bg-blue-500 transition-all shadow-xl active:scale-95">
             Get Started Free <span className="text-2xl">→</span>
          </a>
        </div>
      </section>

      {/* 7. Footer Section (Exact Image 7 style) */}
      <footer className="bg-black/60 backdrop-blur-3xl pt-20 pb-10 px-6 border-t border-white/10 font-medium">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="space-y-4">
            <h4 className="text-xl font-black tracking-tighter italic italic">MLT Prep</h4>
            <p className="text-white/50 text-[13px] leading-relaxed max-w-2xl italic">MLT Prep is India's premier exam preparation platform for medical lab technicians. We offer AI-powered practice questions, comprehensive previous year papers, and full-length mock tests designed for DMLT, BMLT, AIIMS, ESIC, RRB Paramedical, and state government exams.</p>
          </div>

          {/* Tag Cloud Area */}
          <div className="flex flex-wrap gap-2 py-8 border-y border-white/5">
            {["MLT Exam", "Medical Lab Technician", "DMLT Medical Lab Course", "BMLT Medical Lab Course", "Lab Technician Govt Exam", "Medical Lab PYQs", "Medical Lab MCQs", "MLT Mock Tests", "Paramedical Exam"].map((tag, i) => (
                <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[11px] font-bold text-white/50">{tag}</span>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
            <div className="space-y-4">
              <h5 className="font-black text-white/40 uppercase tracking-[4px] text-[10px]">Quick Links</h5>
              <div className="flex flex-col gap-4 text-white/60 font-bold">
                <a href="#" className="hover:text-white transition-colors">Contact Us</a>
                <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              </div>
            </div>
            <div className="space-y-4">
              <h5 className="font-black text-white/40 uppercase tracking-[4px] text-[10px]">Preparation</h5>
              <div className="flex flex-col gap-4 text-white/60 font-bold">
                <a href="#" className="hover:text-white transition-colors">Medical Lab Technician Exam</a>
                <a href="#" className="hover:text-white transition-colors">Lab Technician Govt Exam</a>
                <a href="#" className="hover:text-white transition-colors">DMLT Medical Lab Course</a>
              </div>
            </div>
            <div className="space-y-4">
              <h5 className="font-black text-white/40 uppercase tracking-[4px] text-[10px]">Policies</h5>
              <div className="flex flex-col gap-4 text-white/60 font-bold">
                <a href="#" className="hover:text-white transition-colors">Shipping Policy</a>
                <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 text-center text-[10px] text-white/30 uppercase tracking-[5px] font-black italic">
            © 2026 MLT Prep. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
