import { Blocks, BarChart3, Rocket, Users, Share2, Lock } from "lucide-react";
import { motion } from "framer-motion";

const GoalsSection = () => {
  const goals = [
    {
      icon: <Blocks className="w-8 h-8 text-primary" />,
      title: "AI-Powered Marketplace",
      description: "Curating the best AI tools and automation solutions to help businesses transform their operations"
    },
    {
      icon: <Users className="w-8 h-8 text-secondary" />,
      title: "Developer Empowerment",
      description: "Supporting Indian developers by providing a platform to showcase and distribute their innovative solutions"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: "Business Growth",
      description: "Helping organizations discover and implement AI solutions that drive real business value"
    },
    {
      icon: <Share2 className="w-8 h-8 text-secondary" />,
      title: "Community-Driven",
      description: "Building a thriving ecosystem where developers and businesses can connect and collaborate"
    },
    {
      icon: <Rocket className="w-8 h-8 text-primary" />,
      title: "Innovation Hub",
      description: "Accelerating AI adoption by making cutting-edge tools accessible and affordable"
    },
    {
      icon: <Lock className="w-8 h-8 text-secondary" />,
      title: "Trust & Security",
      description: "Ensuring all listed tools meet high standards of security and reliability"
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
            Our Goals
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Building India's premier marketplace for AI tools and automation solutions,
            where innovation meets practical business needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {goals.map((goal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 rounded-xl border border-white/10 hover:border-primary/20 transition-all duration-300"
            >
              <div className="mb-4">{goal.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{goal.title}</h3>
              <p className="text-muted-foreground">{goal.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GoalsSection;