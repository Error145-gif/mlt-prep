import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center bg-white p-4"
    >
      <div className="max-w-2xl w-full flex flex-col items-center text-center space-y-8">
        <img 
          src="https://harmless-tapir-303.convex.cloud/api/storage/0927b7f9-c0f5-4adc-8f97-da0dcf594dfc" 
          alt="404 Page Not Found" 
          className="w-full h-auto max-h-[60vh] object-contain"
        />
        
        <Button 
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Go Back Home
        </Button>
      </div>
    </motion.div>
  );
}