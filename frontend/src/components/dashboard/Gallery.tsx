
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Shield, Zap, Activity, Users, Globe } from "lucide-react";

const Gallery = () => {
  const galleryItems = [
    {
      title: "Supply Chain Tracking",
      description: "Real-time visibility across the entire supply chain",
      icon: <Package className="w-8 h-8 text-yellow-600" />,
      category: "Logistics"
    },
    {
      title: "Secure Transactions",
      description: "Cryptographically secured financial transactions",
      icon: <Shield className="w-8 h-8 text-blue-900" />,
      category: "Security"
    },
    {
      title: "Smart Contracts",
      description: "Automated contract execution and compliance",
      icon: <Zap className="w-8 h-8 text-orange-600" />,
      category: "Automation"
    },
    {
      title: "Data Analytics",
      description: "Advanced insights from blockchain data",
      icon: <Activity className="w-8 h-8 text-red-600" />,
      category: "Analytics"
    },
    {
      title: "Identity Verification",
      description: "Decentralized identity management",
      icon: <Users className="w-8 h-8 text-blue-600" />,
      category: "Identity"
    },
    {
      title: "Carbon Footprint",
      description: "Environmental impact tracking",
      icon: <Globe className="w-8 h-8 text-green-600" />,
      category: "Sustainability"
    }
  ];

  return (
    <section id="gallery" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            Blockchain Applications
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            Explore the diverse applications of blockchain technology in modern supply chain management
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group cursor-pointer bg-white/80 backdrop-blur-sm border-blue-200/30 hover:bg-white hover:shadow-xl hover:shadow-blue-200/20 transition-all duration-300">
                <CardContent className="p-6">
                  <motion.div
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div 
                      className="mb-4 flex justify-center"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.icon}
                    </motion.div>
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-gray-700 rounded-full mb-3 border border-blue-200">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-bold text-blue-900 mb-2 group-hover:text-gray-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;