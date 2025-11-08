import { motion } from "framer-motion";
import { Globe2, Brain, IndianRupee, Code2, Building2, Stars } from "lucide-react";

const OrganizationImpact = () => {
  const impactMetrics = [
    {
      metric: "30+",
      label: "AI Tools Listed",
      description: "Curated collection of high-quality AI solutions"
    },
    {
      metric: "100+",
      label: "Indian Developers",
      description: "Supporting local tech talent and innovation"
    },
    {
      metric: "24/7",
      label: "Support",
      description: "Round-the-clock assistance for businesses"
    }
  ];

  const uniqueFeatures = [
    {
      icon: <IndianRupee className="w-12 h-12 text-primary" />,
      title: "Made in India, For India",
      description: "Supporting Indian developers and businesses with affordable, locally-optimized AI solutions that understand our market's unique needs."
    },
    {
      icon: <Brain className="w-12 h-12 text-secondary" />,
      title: "AI Marketplace Revolution",
      description: "Think of us as the Play Store for AI - a trusted platform where businesses can discover, compare, and implement AI tools that actually solve real problems."
    },
    {
      icon: <Code2 className="w-12 h-12 text-primary" />,
      title: "Developer First",
      description: "We're building more than a marketplace - we're creating opportunities for developers to showcase their work and reach customers without heavy marketing costs."
    },
    {
      icon: <Building2 className="w-12 h-12 text-secondary" />,
      title: "Business Transformation",
      description: "Helping organizations embrace AI with confidence through verified solutions, custom development, and expert guidance."
    },
    {
      icon: <Globe2 className="w-12 h-12 text-primary" />,
      title: "Distribution Channel",
      description: "Providing Indian developers with a powerful platform to reach global markets while maintaining their independence and control."
    },
    {
      icon: <Stars className="w-12 h-12 text-secondary" />,
      title: "Quality Assurance",
      description: "Every tool on our platform undergoes thorough verification for security, performance, and business value."
    }
  ];

  return (
    <section className="py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Main Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Transforming India's
            </span>
            <br />
            <span className="text-foreground">
              AI Software Landscape
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Building India's most trusted AI marketplace where innovation meets practical business solutions
          </p>
        </motion.div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {impactMetrics.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                {item.metric}
              </div>
              <div className="text-xl font-semibold mb-2">{item.label}</div>
              <div className="text-muted-foreground">{item.description}</div>
            </motion.div>
          ))}
        </div>

        {/* Unique Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {uniqueFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-8 rounded-xl border border-white/10 hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="glass-icon-container p-3 rounded-lg">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrganizationImpact;