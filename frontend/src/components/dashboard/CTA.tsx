import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

const CTA = () => {
  return (
    <section id="contact" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
            Ready to Transform Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Supply Chain?
            </span>
          </h2>
          
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of businesses already using our blockchain-powered platform 
            to create transparent, secure, and efficient supply chains.
          </p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-4 text-lg group border-0 shadow-lg"
              >
                Start Free Trial
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="lg"
                className="border-blue-500 text-blue-700 hover:bg-blue-50 hover:text-blue-800 px-8 py-4 text-lg backdrop-blur-sm"
              >
                <Mail className="h-5 w-5 mr-2" />
                Contact Sales
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 border border-blue-200/30">
              <div className="text-2xl font-bold text-blue-600 mb-2">30-Day</div>
              <div className="text-gray-500 text-sm">Free Trial</div>
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 border border-blue-200/30">
              <div className="text-2xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-500 text-sm">Expert Support</div>
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 border border-blue-200/30">
              <div className="text-2xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-500 text-sm">Uptime Guarantee</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;