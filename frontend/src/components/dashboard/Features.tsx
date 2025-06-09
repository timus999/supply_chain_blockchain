import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, Globe, Lock } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Enhanced Security",
      description: "Military-grade encryption and blockchain technology ensure your supply chain data remains secure and tamper-proof."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Real-time Tracking",
      description: "Track your products from origin to destination with real-time updates and complete visibility across the supply chain."
    },
    {
      icon: <Globe className="w-8 h-8 text-blue-600" />,
      title: "Global Network",
      description: "Connect with suppliers, manufacturers, and distributors worldwide through our decentralized blockchain network."
    },
    {
      icon: <Lock className="w-8 h-8 text-red-600" />,
      title: "Smart Contracts",
      description: "Automate processes with intelligent contracts that execute automatically when predefined conditions are met."
    }
  ];

  return (
    <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            Why Choose SupplyChain3?
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            Experience the future of supply chain management with our cutting-edge blockchain technology
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group cursor-pointer bg-white/80 backdrop-blur-sm border-blue-200/30 hover:bg-white hover:shadow-xl hover:shadow-blue-200/20 transition-all duration-300 h-full">
                <CardContent className="p-6 text-center">
                  <motion.div
                    className="mb-4 flex justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;