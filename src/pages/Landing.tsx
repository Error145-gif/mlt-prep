import React from 'react';

const Landing = () => {
  // Links aur Assets Setup
  const appDownloadLink = "https://drive.google.com/uc?export=download&id=1GYJUbNp9GJuEBYpkF3IwMy6YxvSl8gvz";
  const logoUrl = "https://image2url.com/r2/default/images/1769698877118-e825e96d-5b36-4a37-a651-5bc5090311c9.png";
  
  // Is link ko aap apne Sign In ya Dashboard page ke URL se badal sakte hain
  const authRedirectUrl = "/signin"; 

  return (
    <div className="min-h-screen font-sans text-white selection:bg-purple-500 overflow-x-hidden">
      {/* Background Image Setup */}
      <div className="fixed inset-0 z-[-1]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url('https://image2url.com/r2/default/images/1769696781505-18a8289d-34d3-48bb-9e8c-f8a0e2534e81.jpg')` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-blue-900/80 to-pink-900/70 backdrop-blur-[2px]" />
      </div>

      {/* Header / Navbar */}
      <header className="relative pt-6 px-6 max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Logo Section */}
          <img src={logoUrl} alt="MLT Prep Logo" className="w-10 h-10 object-contain drop-shadow-md" />
          <span className="font-bold text-xl tracking-tight">MLT Prep</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Dashboard Button Kaam Karega */}
          <a href={authRedirectUrl} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2">
            Dashboard <span>↗</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative pt-10 pb-8 px-6 flex flex-col items-center text-center max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-[10px] md:text-xs font-medium mb-8">
          ✨ AI-Powered Medical Lab Technology Learning
        </div>
        
        <h1 className="text-3xl md:text-6xl font-bold leading-tight mb-6 drop-shadow-lg uppercase italic">
          Medical Lab Technician (MLT) Preparation with <span className="text-blue-300">AI-Powered Mock Tests</span>
        </h1>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-2xl mb-12 border-b border-white/10 pb-8">
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl font-black italic">250+</span>
            <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Active Students</span>
          </div>
          <div className="flex flex-col border-x border-white/10">
            <span className="text-2xl md:text-3xl font-black italic">5000+</span>
            <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Questions</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl font-black italic">95%</span>
            <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Success Rate</span>
          </div>
        </div>

        {/* Android Download Button Kaam Karega */}
        <div className="w-full max-w-sm mb-12">
           <a href={appDownloadLink} className="flex items-center justify-center gap-3 w-full py-4 bg-white text-black rounded-2xl font-black text-lg shadow-2xl active:scale-95 transition-all">
             <span className="text-2xl">🤖</span> Download Android App Now
           </a>
        </div>

        {/* Pricing Card Section */}
        <div className="relative w-full max-w-md bg-white/15 backdrop-blur-3xl border border-white/30 rounded-[28px] p-6 shadow-2xl mb-12">
           <div className="flex justify-between items-start mb-6 text-left">
              <div>
                <span className="text-orange-400 text-xs font-bold flex items-center gap-1 italic underline">🔥 Limited Time Offer</span>
                <div className="text-3xl font-black tracking-tight mt-1">₹399 <span className="text-base font-normal opacity-70">/ 4 Months</span></div>
              </div>
              <div className="flex flex-col items-end">
                 <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl shadow-lg uppercase mb-1">MOST POPULAR</span>
              </div>
           </div>
           
           {/* Go to Dashboard Button Kaam Karega */}
           <a href={authRedirectUrl} className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-2xl font-black text-xl hover:brightness-110 transition-all shadow-xl mb-4">
             Go to Dashboard →
           </a>
           
           <p className="text-[11px] font-bold text-white/70">
              ✓ No credit card required • ✓ Cancel anytime
           </p>
        </div>
      </main>

      {/* Everything You Need Section */}
      <section className="py-12 px-6 max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-4xl font-black text-center mb-8 italic uppercase tracking-tighter">Everything You Need to Succeed</h2>
          {[
            { title: "AI-Powered Medical Lab Questions", icon: "🧠", desc: "Practice with AI-generated MCQs tailored to MLT Exam patterns" },
            { title: "Medical Lab PYQs", icon: "📖", desc: "Access comprehensive Medical Lab PYQs organized by year" },
            { title: "MLT Mock Tests", icon: "🏅", desc: "Take full-length tests to simulate real exam conditions" },
            { title: "Track Progress", icon: "📈", desc: "Monitor performance with detailed analytics" },
          ].map((item, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-[24px] flex items-center gap-5 text-left">
              <div className="bg-purple-600/40 p-4 rounded-2xl text-3xl shadow-lg">{item.icon}</div>
              <div>
                <h3 className="font-black text-base md:text-lg mb-0.5 tracking-tight">{item.title}</h3>
                <p className="text-white/50 text-xs font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
      </section>

      {/* Premium Plan Card */}
      <section className="py-20 px-6 max-w-md mx-auto">
        <div className="bg-white/20 backdrop-blur-3xl border-2 border-yellow-500/50 rounded-[35px] p-10 text-center shadow-[0_0_80px_rgba(234,179,8,0.2)] relative">
          <div className="bg-yellow-500 text-black text-[11px] font-black px-6 py-2 rounded-full absolute -top-4 left-1/2 -translate-x-1/2 uppercase">MOST POPULAR</div>
          <h2 className="text-3xl font-black mb-1 italic tracking-tighter">Premium Plan</h2>
          <p className="text-white/70 text-sm mb-8 font-bold italic tracking-wide">Full Access - ₹399/4 months</p>

          <ul className="text-left space-y-5 mb-10 text-[13px] font-bold uppercase tracking-tight">
            <li className="flex items-center gap-4">✓ Unlimited Mock Tests</li>
            <li className="flex items-center gap-4">✓ All PYQ Sets with Solutions</li>
            <li className="flex items-center gap-4">✓ Detailed Performance Analytics</li>
          </ul>

          {/* Upgrade Now Button Kaam Karega */}
          <a href={authRedirectUrl} className="block w-full py-5 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl font-black text-xl text-white shadow-2xl hover:scale-105 transition-all">
            🔥 Upgrade Now - Save ₹97 →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/60 backdrop-blur-3xl pt-20 pb-10 px-6 border-t border-white/10 text-left">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="flex items-center gap-2">
            <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
            <h4 className="text-xl font-black tracking-tighter italic uppercase">MLT Prep</h4>
          </div>
          <div className="grid grid-cols-2 gap-10 text-xs text-white/50 font-bold uppercase tracking-widest">
            <div className="flex flex-col gap-4">
              <span className="text-white/30 text-[10px]">Quick Links</span>
              <a href="#">Contact Us</a>
              <a href="#">Terms & Conditions</a>
              <a href="#">Privacy Policy</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-white/30 text-[10px]">Preparation</span>
              <a href="#">Medical Lab Technician Exam</a>
              <a href={appDownloadLink} className="text-blue-400 italic">Download App</a>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 text-center text-[10px] text-white/20 uppercase tracking-[5px] font-black italic">
            © 2026 MLT Prep. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
