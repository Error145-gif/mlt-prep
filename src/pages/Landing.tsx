const Landing = () => {
  const downloadLink = "https://drive.google.com/uc?export=download&id=1GYJUbNp9GJuEBYpkF3IwMy6YxvSl8gvz";
  const logoUrl = "https://image2url.com/r2/default/images/1769698877118-e825e96d-5b36-4a37-a651-5bc5090311c9.png";
  const authUrl = "/signin";

  return (
    <div className="min-h-screen font-sans text-white selection:bg-purple-500 overflow-x-hidden">
      {/* 1. HERO BACKGROUND & OVERLAY */}
      <div className="fixed inset-0 z-[-1]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://image2url.com/r2/default/images/1769696781505-18a8289d-34d3-48bb-9e8c-f8a0e2534e81.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/70 via-[#1e40af]/80 to-[#db2777]/70 backdrop-blur-[2px]" />
      </div>

      {/* HEADER */}
      <header className="relative pt-6 px-6 max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={logoUrl} alt="MLT Logo" className="w-10 h-10 object-contain drop-shadow-md" />
          <span className="font-bold text-xl tracking-tight">MLT Prep</span>
        </div>
        <div className="flex items-center gap-3">
          <a href={authUrl} className="bg-[#2563eb] hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2">
            Dashboard <span className="text-xs">↗</span>
          </a>
        </div>
      </header>

      {/* HERO CONTENT */}
      <main className="relative pt-10 pb-8 px-6 flex flex-col items-center text-center max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-[10px] md:text-xs font-medium mb-8">
          ✨ AI-Powered Medical Lab Technology Learning
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 drop-shadow-lg uppercase italic tracking-tight">
          Medical Lab Technician (MLT) Exam Preparation with <span className="text-[#93c5fd]">AI-Powered Mock Tests & PYQs</span>
        </h1>
        
        <p className="text-sm md:text-base text-white/80 max-w-2xl mb-10 leading-relaxed font-medium">
          Complete Medical Lab Technician (MLT) Exam preparation for DMLT, BMLT, and Lab Technician Govt Exam with comprehensive MLT Mock Tests, Medical Lab PYQs, and AI-generated Medical Lab MCQs.
        </p>

        {/* STATS SECTION */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-2xl mb-12 border-b border-white/10 pb-8">
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl font-black italic tracking-tighter">250+</span>
            <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest leading-3">Active Students</span>
          </div>
          <div className="flex flex-col border-x border-white/10">
            <span className="text-2xl md:text-3xl font-black italic tracking-tighter">5000+</span>
            <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest leading-3">Practice Questions</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl font-black italic tracking-tighter">95%</span>
            <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest leading-3 text-center">Success Rate</span>
          </div>
        </div>

        {/* 🤖 ANDROID DOWNLOAD BUTTON */}
        <div className="w-full max-w-sm mb-12">
           <a href={downloadLink} className="flex items-center justify-center gap-3 w-full py-4 bg-white text-black rounded-2xl font-black text-lg shadow-2xl hover:bg-gray-100 transition-all active:scale-95 border-b-4 border-gray-300">
             <span className="text-2xl">🤖</span> Download Android App Now
           </a>
        </div>

        {/* OFFER CARD (Image 1 & 2 Style) */}
        <div className="relative w-full max-w-md bg-white/15 backdrop-blur-3xl border border-white/30 rounded-[28px] p-6 shadow-2xl mb-12">
           <div className="flex justify-between items-start mb-6 text-left">
              <div>
                <span className="text-[#fbbf24] text-[10px] font-black uppercase italic underline decoration-orange-500 decoration-2">🔥 Limited Time Offer</span>
                <div className="text-3xl md:text-4xl font-black tracking-tighter mt-1">₹399 <span className="text-base font-normal opacity-70">for 4 Months</span></div>
                <div className="text-white/40 text-[10px] line-through">Regular: ₹496</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                 <span className="bg-[#dc2626] text-white text-[9px] font-black px-3 py-1 rounded-bl-xl shadow-md uppercase tracking-tight">MOST POPULAR</span>
                 <span className="bg-[#b91c1c]/80 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">SAVE ₹97 • 20% OFF</span>
                 <div className="text-[#facc15] text-[10px] font-black italic mt-1 drop-shadow-sm">⭐ Best Value ₹99/mo</div>
              </div>
           </div>
           
           <a href={authUrl} className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-[#3b82f6] via-[#9333ea] to-[#db2777] rounded-2xl font-black text-xl hover:brightness-110 shadow-xl mb-4 active:scale-95 tracking-tight">
             Go to Dashboard →
           </a>
           
           <div className="text-[11px] font-bold text-white/70 space-y-1">
              <p>✓ No credit card required • ✓ Cancel anytime</p>
              <p className="text-white italic">🎁 100% Money-back guarantee - <span className="text-[#facc15] uppercase not-italic">Risk FREE!</span></p>
           </div>
        </div>
      </main>

      {/* 📋 FEATURES SECTION (Image 3 & 4) */}
      <section className="py-12 px-6 max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-4xl font-black text-center mb-10 italic uppercase tracking-tighter leading-none">Everything You Need to Succeed</h2>
          {[
            { title: "AI-Powered Medical Lab Questions", icon: "🧠", desc: "Practice with AI-generated Medical Lab MCQs tailored to MLT Exam and Lab Technician Exam patterns" },
            { title: "Medical Lab PYQs", icon: "📖", desc: "Access comprehensive Medical Lab PYQs and MLT Previous Year Questions organized by exam and year" },
            { title: "MLT Mock Tests", icon: "🏅", desc: "Take full-length MLT Mock Tests and Lab Technician Govt Exam practice tests to simulate real exam conditions" },
            { title: "Track Medical Lab Tech Progress", icon: "📈", desc: "Monitor your Medical Lab Technician Exam performance with detailed analytics and rankings" },
          ].map((item, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-[26px] flex items-center gap-6 text-left hover:bg-white/15 transition-all shadow-inner">
              <div className="bg-[#9333ea]/30 p-4 rounded-2xl text-3xl shadow-lg border border-white/10">{item.icon}</div>
              <div className="flex-1">
                <h3 className="font-black text-lg mb-1 tracking-tight leading-none">{item.title}</h3>
                <p className="text-white/50 text-xs md:text-[13px] font-medium leading-tight">{item.desc}</p>
              </div>
            </div>
          ))}
      </section>

      {/* 💎 PREMIUM SECTION (Image 5 & 6) */}
      <section className="py-16 px-6 max-w-md mx-auto">
        <div className="bg-white/20 backdrop-blur-3xl border-2 border-[#facc15]/40 rounded-[35px] p-10 text-center shadow-[0_0_80px_rgba(234,179,8,0.2)] relative overflow-hidden">
          <div className="bg-[#facc15] text-black text-[10px] font-black px-6 py-2 rounded-full absolute -top-4 left-1/2 -translate-x-1/2 uppercase shadow-xl tracking-widest">MOST POPULAR</div>
          <h2 className="text-3xl font-black mb-1 italic tracking-tighter leading-none uppercase">Premium Plan</h2>
          <p className="text-white/70 text-sm mb-8 font-bold italic tracking-wide">Full Access - ₹399/4 months</p>

          <ul className="text-left space-y-5 mb-10 text-[13px] font-bold uppercase tracking-tight opacity-90">
            {["Unlimited Mock Tests", "All PYQ Sets with Solutions", "Unlimited AI Practice", "Detailed Performance Analytics", "Rank & Leaderboard Access", "Topic-wise Weak Area Analysis"].map((list, i) => (
              <li key={i} className="flex items-center gap-4 drop-shadow-md">
                <span className="text-[#4ade80] text-xl font-bold">✓</span> {list}
              </li>
            ))}
          </ul>

          <a href={authUrl} className="block w-full py-5 bg-gradient-to-r from-[#ea580c] to-[#dc2626] rounded-2xl font-black text-xl text-white shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-tighter border-b-4 border-red-800">
             🔥 Upgrade Now - Save ₹97 →
          </a>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 p-12 rounded-[40px] text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tighter italic uppercase leading-none underline decoration-blue-500 underline-offset-8">Ready to Start Your Journey?</h2>
          <p className="text-white/60 mb-12 max-w-md mx-auto font-medium italic leading-relaxed">Join thousands of students preparing for DMLT, BMLT, and government lab technician exams with our comprehensive platform</p>
          <a href={authUrl} className="inline-flex items-center justify-center gap-4 px-12 py-5 bg-[#2563eb] rounded-2xl font-black text-xl shadow-xl transition-all active:scale-95 border-b-4 border-blue-800">
             Get Started Free <span className="text-2xl font-normal tracking-normal">→</span>
          </a>
        </div>
      </section>

      {/* FOOTER (Image 7) */}
      <footer className="bg-black/70 backdrop-blur-3xl pt-20 pb-10 px-6 border-t border-white/10 font-medium">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <img src={logoUrl} alt="Logo" className="w-9 h-9 object-contain" />
                <h4 className="text-xl font-black tracking-tighter italic uppercase underline decoration-[#2563eb] decoration-4">MLT Prep</h4>
             </div>
            <p className="text-white/40 text-[13px] leading-relaxed max-w-2xl italic">MLT Prep is India's premier exam preparation platform for medical lab technicians. We offer AI-powered practice questions, previous year papers, and mock tests for DMLT, BMLT, AIIMS, ESIC, and state government exams.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
            <div className="space-y-5">
              <h5 className="font-black text-white/30 uppercase tracking-[5px] text-[10px] border-b border-white/10 pb-2">Quick Links</h5>
              <div className="flex flex-col gap-3 text-white/60 font-bold italic">
                <a href="#" className="hover:text-white transition-colors">Contact Us</a>
                <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              </div>
            </div>
            <div className="space-y-5">
              <h5 className="font-black text-white/30 uppercase tracking-[5px] text-[10px] border-b border-white/10 pb-2">Preparation</h5>
              <div className="flex flex-col gap-3 text-white/60 font-bold italic">
                <a href="#" className="hover:text-white transition-colors">Medical Lab Technician Exam</a>
                <a href="#" className="hover:text-white transition-colors">Lab Technician Govt Exam</a>
                <a href="#" className="hover:text-white transition-colors">DMLT Medical Lab Course</a>
              </div>
            </div>
            <div className="space-y-5">
              <h5 className="font-black text-white/30 uppercase tracking-[5px] text-[10px] border-b border-white/10 pb-2">Policies</h5>
              <div className="flex flex-col gap-3 text-white/60 font-bold italic">
                <a href="#" className="hover:text-white transition-colors">Shipping Policy</a>
                <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 text-center text-[10px] text-white/20 uppercase tracking-[6px] font-black italic">
            © 2026 MLT Prep. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
