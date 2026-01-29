import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import { useEffect } from "react";

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "MLT Prep - Medical Lab Technician Exam Preparation";

    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content =
      "MLT Prep is India's leading platform for Medical Lab Technician exam preparation with mock tests, PYQs and AI practice.";
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  const downloadApp = () => {
    window.location.href =
      "https://drive.google.com/uc?export=download&id=1GYJUbNp9GJuEBYpkF3IwMy6YxvSl8gvz";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 text-white">

      {/* HERO */}
      <section className="px-5 pt-20 pb-16 text-center">
        <h1 className="text-4xl font-bold leading-tight">
          Medical Lab Technician (MLT) Exam Preparation
        </h1>

        <p className="text-white/80 mt-4 text-sm">
          Complete preparation for DMLT, BMLT & Government Lab Technician Exams
        </p>

        <div className="flex flex-col gap-4 mt-8 items-center">

          <Button
            onClick={() => navigate("/auth")}
            className="w-full max-w-xs bg-gradient-to-r from-blue-600 to-purple-700"
          >
            Start Learning <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button
            onClick={downloadApp}
            className="w-full max-w-xs bg-green-600 hover:bg-green-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Download MLT Prep App
          </Button>

        </div>
      </section>

      {/* FEATURES */}
      <section className="px-5 space-y-5 pb-16">

        <Feature
          title="AI Powered Medical Lab Questions"
          desc="Practice AI generated MCQs based on real exam pattern"
        />

        <Feature
          title="Medical Lab PYQs"
          desc="Previous year questions with structured sets"
        />

        <Feature
          title="MLT Mock Tests"
          desc="Full length mock tests for real exam experience"
        />

        <Feature
          title="Track Medical Lab Progress"
          desc="Detailed analytics and performance tracking"
        />

      </section>

      {/* CTA */}
      <section className="px-5 pb-20">
        <div className="bg-white/15 backdrop-blur-lg rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold">Ready to Start Your Journey?</h2>

          <p className="text-white/70 text-sm mt-3">
            Join thousands of students preparing smarter
          </p>

          <Button
            onClick={() => navigate("/auth")}
            className="mt-6 bg-gradient-to-r from-blue-600 to-purple-700"
          >
            Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black/20 backdrop-blur-lg px-5 py-10">

        <div className="space-y-8">

          <div>
            <h3 className="font-semibold text-lg">MLT Prep</h3>
            <p className="text-sm text-white/70 mt-2">
              India's leading exam preparation platform for medical lab technicians.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="text-sm text-white/70 space-y-2 mt-2">
              <li onClick={() => navigate("/contact-us")} className="cursor-pointer hover:text-white">Contact Us</li>
              <li onClick={() => navigate("/terms")} className="cursor-pointer hover:text-white">Terms & Conditions</li>
              <li onClick={() => navigate("/privacy")} className="cursor-pointer hover:text-white">Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Medical Lab Exam</h3>
            <ul className="text-sm text-white/70 space-y-2 mt-2">
              <li onClick={() => navigate("/mlt-exam")} className="cursor-pointer hover:text-white">MLT Exam</li>
              <li onClick={() => navigate("/lab-technician-exam")} className="cursor-pointer hover:text-white">Lab Technician Exam</li>
              <li onClick={() => navigate("/dmlt-exam")} className="cursor-pointer hover:text-white">DMLT Course</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Policies</h3>
            <ul className="text-sm text-white/70 space-y-2 mt-2">
              <li onClick={() => navigate("/shipping-policy")} className="cursor-pointer hover:text-white">Shipping Policy</li>
              <li onClick={() => navigate("/refund-policy")} className="cursor-pointer hover:text-white">Refund Policy</li>
            </ul>
          </div>

        </div>

        <div className="text-center text-xs text-white/60 mt-10 border-t border-white/20 pt-5">
          © 2024 MLT Prep. All rights reserved.
        </div>

      </footer>

    </div>
  );
}

/* SAFE FEATURE COMPONENT */
function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white/15 backdrop-blur-lg p-5 rounded-xl">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-white/70 mt-2">{desc}</p>
    </div>
  );
}