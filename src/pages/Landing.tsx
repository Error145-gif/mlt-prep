const Landing = () => {
  // Aapka Google Drive Link - Sirf download button ke liye
  const appDownloadLink = "https://drive.google.com/uc?export=download&id=1GYJUbNp9GJuEBYpkF3IwMy6YxvSl8gvz";

  return (
    <div className="min-h-screen font-sans text-white selection:bg-purple-500 overflow-x-hidden">
      {/* Background Layer (Screenshots ke jaisa) */}
      <div className="fixed inset-0 z-[-1]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url('https://image2url.com/r2/default/images/1769696781505-18a8289d-34d3-48bb-9e8c-f8a0e2534e81.jpg')` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800/70 via-blue-900/80 to-pink-800/70 backdrop-blur-[2px]" />
      </div>

      {/* Hero Section */}
      <header className="relative pt-12 pb-8 px-6 flex flex-col items-center text-center max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-[10px] md:text-xs font-medium mb-6">
          ✨ AI-Powered Medical Lab Technology Learning
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 drop-shadow-lg">
          Medical Lab Technician (MLT) Exam Preparation with <span className="text-blue-300">AI-Powered Mock Tests & PYQs</span>
        </h1>
        
        <p className="text-sm md:text-base text-white/80 max-w-2xl mb-10 leading-relaxed">
          Complete preparation for DMLT, BMLT, and Lab Technician Govt Exams.
        </p>

        {/* ONLY NEW DOWNLOAD BUTTON WITH LINK */}
        <div className="flex flex-col items-center gap-3 w-full max-w-sm mb-12">
           <a 
             href={appDownloadLink} 
             className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-xl active:scale-95"
           >
             Download Official App →
           </a>
           <p className="text-[10px] text-white/50 uppercase tracking-[2px]">Android APK v1.0.4</p>
        </div>

        {/* Offer Card (Website Dashboard - No Download Link Here) */}
        <div className="relative w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[24px] p-6 shadow-2xl">
           <div className="flex justify-between items-start mb-6 text-left">
              <div>
                <span className="text-orange-400 text-[10px] font-black uppercase italic">🔥 Limited Time Offer</span>
                <div className="text-3xl font-bold">₹399 for 4 Months</div>
                <div className="text-white/50 text-xs line-through">Regular: ₹496</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                 <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">MOST POPULAR</span>
                 <span className="bg-red-700 text-white text-[10px] font-bold px-2 py-1 rounded">20% OFF</span>
              </div>
           </div>
           
           {/* Website Action */}
           <a href="/dashboard" className="block w-full py-4 bg-blue-600 rounded-xl font-bold text-lg hover:bg-blue-500 transition-colors shadow-lg mb-4">
             Go to Dashboard
           </a>
           
           <div className="text-[11px] text-white/60 space-y-1">
              <p>✓ No credit card required • ✓ Cancel anytime</p>
              <p className="text-yellow-400 font-bold italic tracking-tight">🎁 100% Money-back guarantee - Risk FREE!</p>
           </div>
        </div>
      </header>

      {/* Feature Cards (Image 3 style) */}
      <section className="py-12 px-6 max-w-4xl mx-auto space-y-4 text-left">
          {[
            { title: "AI-Powered Medical Lab Questions", icon: "🧠", desc: "Practice with AI-generated MCQs tailored to MLT Exam patterns." },
            { title: "Medical Lab PYQs", icon: "📖", desc: "Access comprehensive Previous Year Questions organized by year." },
            { title: "MLT Mock Tests", icon: "🏅", desc: "Full-length mock tests to simulate real exam conditions." },
          ].map((item, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-lg border border-white/10 p-5 rounded-[22px] flex items-center gap-4">
              <div className="bg-blue-500/20 p-3 rounded-xl text-2xl">{item.icon}</div>
              <div>
                <h3 className="font-bold text-sm md:text-base">{item.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
      </section>

      {/* Pricing Section (No Download Link Here) */}
      <section className="py-16 px-6 max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[30px] p-8 text-center shadow-2xl relative">
          <div className="bg-yellow-500 text-black text-[10px] font-black px-4 py-1 rounded-full absolute -top-3 left-1/2 -translate-x-1/2">PREMIUM</div>
          <h2 className="text-2xl font-bold mb-1">Premium Plan</h2>
          <p className="text-white/60 text-sm mb-8">Full Access for Website Users</p>

          <ul className="text-left space-y-4 mb-8 text-sm opacity-90">
            {["Unlimited Mock Tests", "All PYQ Sets with Solutions", "Unlimited AI Practice", "Detailed Performance Analytics"].map((list, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="text-green-400 font-bold">✓</span> {list}
              </li>
            ))}
          </ul>

          <a href="/upgrade" className="block w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all">
            🔥 Upgrade Now - Save ₹97 →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/60 backdrop-blur-2xl pt-12 pb-6 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center md:flex-row md:text-left md:justify-between gap-8">
          <div className="max-w-xs">
            <h4 className="font-bold mb-3 italic tracking-tighter text-xl">MLT PREP</h4>
            <p className="text-white/30 text-[10px] leading-relaxed uppercase tracking-widest">India's leading exam preparation platform.</p>
          </div>
          
          <div className="flex gap-10 text-[10px] uppercase font-bold tracking-widest text-white/50">
             <a href="#" className="hover:text-white">Privacy</a>
             <a href="#" className="hover:text-white">Terms</a>
             <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
        <div className="mt-12 text-center text-white/20 text-[9px] uppercase tracking-[5px]">
          © 2026 MLT PREP. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
