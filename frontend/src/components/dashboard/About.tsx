import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const stats = [
    { number: "500+", label: "Companies Trust Us" },
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "50M+", label: "Transactions Processed" },
    { number: "15+", label: "Countries Served" }
  ];

  return (
    <section id="about" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-blue-900 mb-6">
              Revolutionizing Supply Chain Management
            </h2>
            <p className="text-lg text-gray-500 mb-6 leading-relaxed">
              SupplyChain3 leverages cutting-edge blockchain technology to create transparent, 
              secure, and efficient supply chain networks. Our platform enables businesses to 
              track products from origin to consumer with unprecedented accuracy and trust.
            </p>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
              Built on a foundation of innovation and reliability, we're transforming how 
              businesses manage their supply chains in the digital age. Join the revolution 
              and experience the future of supply chain management today.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200/30 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-blue-900 mb-6">Our Mission</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-500">
                      Create a transparent and trustworthy global supply chain ecosystem
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-500">
                      Eliminate fraud and counterfeit products through blockchain verification
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-500">
                      Reduce costs and improve efficiency through smart contract automation
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-500">
                      Enable sustainable and ethical business practices through transparency
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;