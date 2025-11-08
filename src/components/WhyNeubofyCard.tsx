import React from "react";

const WhyNeubofyCard: React.FC = () => {
  return (
    <aside className="glass-card p-8 md:p-10 rounded-2xl shadow-elevated max-w-4xl mx-auto bg-black/5 dark:bg-white/5 backdrop-blur-md border border-white/10">
      <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">Why Neubofy</h3>
      <p className="text-base text-muted-foreground/90 mb-6">
        Neubofy is a marketplace for SaaS products, AI agents and automation tools. We help verified
        developers build and distribute custom AI agents tailored for real tasks, and we let other
        creators list their tools for free so great ideas reach users quickly.
      </p>

      <ul className="list-inside list-disc space-y-2 text-sm text-foreground">
        <li>Curated Playstore for SaaS, AI agents & automation tools</li>
        <li>Verified developers who build custom agents on request</li>
        <li>Free listing & distribution support for creators, especially Indian developers</li>
        <li>Focus on discoverability and real-world adoption</li>
      </ul>
    </aside>
  );
};

export default WhyNeubofyCard;
