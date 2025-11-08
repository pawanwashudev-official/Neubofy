import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Play, Code, Star, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import GoToTop from "@/components/GoToTop";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import NewProductForm from "@/components/NewProductForm";

const Creations = () => {
  const navigate = useNavigate();
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);

  type CreationItem = {
    slug: string;
    name: string;
    shortDescription: string;
    detailDescription: string;
    thumbnailUrl: string;
    imageUrls: string[];
    publishedAt: string;
    status?: string;
    category?: string;
    tags?: string[];
    features?: string[];
    demoUrl?: string;
    caseStudyUrl?: string;
  };

  const [creations, setCreations] = useState<CreationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        console.log('Loading product index...');
        const res = await fetch('/product_index.json', { cache: 'no-cache' });
        if (!res.ok) throw new Error(`Failed to load product_index.json: ${res.status}`);
        const data = await res.json();
        console.log('Product index loaded:', data);
        
        const files = (data?.files as string[] | undefined) || [];
        if (!Array.isArray(files)) throw new Error('Invalid manifest format. Expected { files: [...] }');
        console.log('Files to load:', files);
        
        const detailPromises = files.map(async (entry) => {
          const fileName = entry;
          console.log(`Loading product file: ${fileName}`);
          try {
            const r = await fetch(`/product/${fileName}`, { cache: 'no-cache' });
            if (!r.ok) throw new Error(`Failed to load ${fileName}: ${r.status}`);
            const text = await r.text(); // First get the raw text
            console.log(`Raw content for ${fileName}:`, text.slice(0, 100) + '...'); // Log the first 100 chars
            try {
              const product = JSON.parse(text);
              console.log(`Successfully loaded ${fileName}:`, product);
              return product as CreationItem;
            } catch (parseError) {
              throw new Error(`Invalid JSON in ${fileName}: ${parseError.message}`);
            }
          } catch (fetchError) {
            console.error(`Error with ${fileName}:`, fetchError);
            throw fetchError;
          }
        });
        
        const detailed = await Promise.all(detailPromises);
        console.log('All products loaded:', detailed);
        if (isMounted) setCreations(detailed);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        console.error('Error loading products:', message);
        if (isMounted) setError(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);
  
  const uniqueCategories = useMemo(() => {
    const cats = creations
      .map(c => c.category)
      .filter((c): c is string => Boolean(c));
    return ["All", ...Array.from(new Set(cats))];
  }, [creations]);
  
  const filteredCreations = useMemo(() => {
    return selectedCategory === "All"
      ? creations
      : creations.filter(creation => creation.category === selectedCategory);
  }, [creations, selectedCategory]);

  //

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "In Development": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Coming Soon": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen animated-gradient">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <Reveal>
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-4 md:mb-6 gradient-text">
            Our Creations
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See what Neubofy can build for you. Each solution is custom-crafted with privacy, 
            innovation, and your success in mind.
          </p>
        </div>
        </Reveal>

        {/* Category Filter */}
        <Reveal>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8 md:mb-10">
          {uniqueCategories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              className={selectedCategory === category 
                ? "btn-hero" 
                : "btn-outline-glow"
              }
            >
              {category}
            </Button>
          ))}
        </div>
        </Reveal>

        {/* Results Count */}
        <Reveal>
        <div className="text-center mb-6">
          <p className="text-muted-foreground">
            Showing {filteredCreations.length} of {creations.length} creations
          </p>
        </div>
        </Reveal>

        {/* Creations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
          {filteredCreations.map((creation, index) => (
            <Reveal key={creation.slug} delay={index * 0.05}>
              <button
                onClick={() => navigate(`/creations/${creation.slug}`)}
                className="text-left w-full glass-card rounded-2xl overflow-hidden hover:shadow-elevated transition-all duration-500 group"
              >
                <div className="relative">
                  <AspectRatio ratio={16/9}>
                    <img
                      src={creation.thumbnailUrl}
                      alt={creation.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </AspectRatio>
                  
                  {creation.category && (
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary">{creation.category}</Badge>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {creation.name}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {creation.shortDescription}
                  </p>

                  {creation.tags && creation.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {creation.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-auto">
                    <Button variant="outline" className="group">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        {/* Add New Project Section */}
        <Reveal>
        <div className="glass-card p-8 rounded-2xl text-center">
          <Plus className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-2xl font-bold mb-4 gradient-text">Have an AI Project to Share?</h3>
          <p className="text-muted-foreground mb-6 text-lg">
            Submit your AI or automation project to be featured in our marketplace.
            Join our growing community of innovators and developers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-hero" onClick={() => setIsProductFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              List Your Project
            </Button>
            <Button variant="outline" className="btn-outline-glow" asChild>
              <Link to="/contact">
                <Code className="w-4 h-4 mr-2" />
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
        </Reveal>
      </div>

      {/* Project Submission Form Modal */}
      {isProductFormOpen && (
        <NewProductForm onClose={() => setIsProductFormOpen(false)} />
      )}

      <Footer />
      <GoToTop />
    </div>
  );
};

export default Creations;