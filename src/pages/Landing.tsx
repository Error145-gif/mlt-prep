import React from "react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">

      {/* HERO */}
      <section className="px-5 pt-20 pb-16 text-center">

        <span className="inline-block mb-4 px-4 py-2 bg-white/20 rounded-full backdrop-blur text-sm">
          AI-Powered Medical Lab Technology Learning
        </span>

        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          Medical Lab Technician (MLT) Exam Preparation
        </h1>

        <h2 className="text-yellow-300 text-xl md:text-2xl font-semibold mt-3">
          with AI-Powered Mock Tests & PYQs
        </h2>

        <p className="text-white/80 mt-4 max-w-xl mx-auto">
          Complete preparation for DMLT, BMLT and Lab Technician Government Exams
        </p>

        <div className="mt-6 flex flex-col gap-4 items-center">

          <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-xl font-semibold w-full max-w-xs">
            Start Learning →
          </button>

          <a
            href="https://drive.google.com/uc?export=download&id=1GYJUbNp9GJuEBYpkF3IwMy6YxvSl8gvz"
            className="bg-green-500 px-6 py-3 rounded-xl font-semibold w-full max-w-xs text-center"
          >
            ⬇ Download MLT Prep App
          </a>

        </div>

      </section>


      {/* FEATURES */}
      <section className="px-5 py-10 space-y-6">

        {[
          {
            title: "AI-Powered Medical Lab Questions",
            desc: "Practice AI generated MCQs based on latest exam pattern"
          },
          {
            title: "Medical Lab PYQs",
            desc: "Previous year questions with structured sets"
          },
          {
            title: "MLT Mock Tests",
            desc: "Full length mock tests for real exam practice"
          },
          {
            title: "Track Medical Lab Tech Progress",
            desc: "Performance analytics & ranking system"
          }
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5"
          >
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-white/70 text-sm mt-1">{item.desc}</p>
          </div>
        ))}

      </section>


      {/* CTA */}
      <section className="px-5 py-16 text-center">

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">

          <h2 className="text-2xl font-bold mb-3">
            Ready to Start Your Journey?
          </h2>

          <p className="text-white/70 mb-5">
            Join thousands of students preparing smarter with MLT Prep
          </p>

          <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-xl font-semibold">
            Get Started Free →
          </button>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="bg-white/5 backdrop-blur-xl border-t border-white/10 py-12 px-5">

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">

          <div>
            <h3 className="font-semibold mb-3">MLT Prep</h3>
            <p className="text-white/70 text-sm">
              India's leading exam preparation platform for Medical Lab
              Technicians.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="text-white/70 text-sm space-y-2">
              <li>Contact Us</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Exam Categories</h3>
            <ul className="text-white/70 text-sm space-y-2">
              <li>MLT Exam</li>
              <li>DMLT Course</li>
              <li>BMLT Course</li>
            </ul>
          </div>

        </div>

        <p className="text-center text-white/50 text-sm mt-10">
          © 2024 MLT Prep. All rights reserved.
        </p>

      </footer>

    </div>
  );
};

export default Landing;