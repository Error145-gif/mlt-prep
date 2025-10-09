import { motion } from "framer-motion";

interface AmoebaLoaderProps {
  text?: string;
}

export default function AmoebaLoader({ text = "Loading..." }: AmoebaLoaderProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-400/25 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md px-8">
        {/* Amoeba Container */}
        <div className="relative h-32 flex items-center justify-center">
          {/* Food particles that get "eaten" */}
          {[0, 1, 2, 3, 4].map((index) => (
            <motion.div
              key={index}
              className="absolute w-4 h-4 rounded-full bg-blue-400"
              initial={{ x: -100, opacity: 1 }}
              animate={{
                x: ["-100px", "400px"],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: index * 0.4,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}

          {/* Amoeba (Pac-Man style movement) */}
          <motion.div
            className="relative z-10"
            animate={{
              x: ["-150px", "150px", "-150px"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <motion.img
              src="https://harmless-tapir-303.convex.cloud/api/storage/17718bdf-fd9c-4dfa-b5d8-231ca3f000dd"
              alt="Loading"
              className="w-24 h-24 object-contain"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                filter: "drop-shadow(0 0 20px rgba(255, 255, 0, 0.5))",
              }}
            />
          </motion.div>
        </div>

        {/* Loading Text */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.p
            className="text-white text-2xl font-bold drop-shadow-lg"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {text}
          </motion.p>
          
          {/* Animated dots */}
          <div className="flex justify-center gap-2 mt-4">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-3 h-3 bg-white rounded-full"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
