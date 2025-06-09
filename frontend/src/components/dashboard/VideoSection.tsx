import { motion, useInView } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-40%" });

  useEffect(() => {
    if (isInView && !isPlaying) {
      setIsPlaying(true);
    }
  }, [isInView]);

  return (
    <section 
      id="video" 
      ref={sectionRef}
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50 to-blue-100"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-blue-900 mb-6">
            See Our Platform in Action
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Watch how our blockchain-powered supply chain management system transforms businesses
          </p>
        </motion.div>

        <motion.div
          className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="relative bg-gradient-to-br from-blue-100/50 to-white/70 backdrop-blur-md rounded-2xl border border-blue-200/30 overflow-hidden aspect-video">
            {/* Video container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-blue-100/50 to-white/80">
                {/* Video player */}
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    src="/demo-video.mp4" // Replace with real video later
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    autoPlay={isPlaying}
                  />
                  
                  {/* Play/pause overlay */}
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100/50 to-white/80">
                      <motion.div
                        className="text-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <motion.button
                          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full mb-4 hover:shadow-lg hover:shadow-blue-300/50 transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsPlaying(true)}
                        >
                          <Play className="w-8 h-8 ml-1" />
                        </motion.button>
                        <p className="text-blue-900 text-lg font-medium">
                          Click to Play Demo
                        </p>
                      </motion.div>
                    </div>
                  )}
                  
                  {/* Pause button overlay */}
                  {isPlaying && (
                    <motion.button
                      className="absolute bottom-6 right-6 flex items-center justify-center w-12 h-12 bg-black/30 text-white rounded-full backdrop-blur-sm hover:bg-black/50 transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsPlaying(false)}
                    >
                      <Pause className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Video description */}
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-500 max-w-2xl mx-auto">
              This video showcases the key features of our supply chain management platform, 
              including real-time tracking, smart contract automation, and blockchain transparency.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;