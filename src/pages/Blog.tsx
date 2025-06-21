
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Calendar, BookOpen } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import BlogCard from "@/components/blog/BlogCard";
import BlogModal from "@/components/blog/BlogModal";
import { useToast } from "@/hooks/use-toast";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Mock blog data with full content
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: "The Future of AI in Creative Industries",
      excerpt: "Exploring how artificial intelligence is revolutionizing creative workflows and empowering artists, writers, and designers to push the boundaries of innovation.",
      content: "Artificial Intelligence is transforming the creative landscape in unprecedented ways. From AI-powered design tools that can generate stunning visuals in seconds to writing assistants that help authors overcome writer's block, the integration of AI in creative industries is creating new possibilities for human expression. This technological revolution isn't replacing human creativity—it's amplifying it. Artists are now able to explore concepts and iterate on ideas faster than ever before, while maintaining their unique creative voice. The future holds even more exciting possibilities as AI continues to evolve and integrate more seamlessly into creative workflows.",
      author: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg",
        role: "AI Researcher"
      },
      publishedAt: "2025-01-15",
      readTime: "8 min read",
      category: "Technology",
      tags: ["AI", "Creativity", "Innovation"],
      likes: 234,
      comments: 18,
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Building Sustainable E-commerce in 2025",
      excerpt: "A comprehensive guide to creating environmentally conscious online businesses that prioritize sustainability without compromising on growth.",
      content: "Sustainability in e-commerce is no longer just a trend—it's a necessity. As consumers become more environmentally conscious, businesses must adapt their practices to meet these expectations while maintaining profitability. This involves everything from eco-friendly packaging solutions to carbon-neutral shipping options. Successful sustainable e-commerce businesses are finding innovative ways to reduce their environmental impact while actually improving their bottom line. The key is to view sustainability not as a cost center, but as a competitive advantage that resonates with modern consumers.",
      author: {
        name: "Marcus Rodriguez",
        avatar: "/placeholder.svg",
        role: "Sustainability Expert"
      },
      publishedAt: "2025-01-12",
      readTime: "12 min read",
      category: "Business",
      tags: ["E-commerce", "Sustainability", "Green Tech"],
      likes: 189,
      comments: 24,
      image: "/placeholder.svg"
    },
    {
      id: 3,
      title: "The Art of Digital Storytelling",
      excerpt: "Mastering the craft of engaging your audience through compelling narratives in the digital age. Learn techniques used by top content creators.",
      content: "Digital storytelling combines the ancient art of narrative with modern technology to create compelling experiences that resonate with audiences across various platforms. Whether you're creating content for social media, building a brand narrative, or developing educational materials, the principles of good storytelling remain constant: character, conflict, and resolution. However, digital platforms offer unique opportunities to make stories interactive, immersive, and shareable. The most successful digital storytellers understand how to leverage these tools while staying true to the fundamental elements that make stories compelling.",
      author: {
        name: "Emma Thompson",
        avatar: "/placeholder.svg",
        role: "Content Creator"
      },
      publishedAt: "2025-01-10",
      readTime: "6 min read",
      category: "Creative",
      tags: ["Storytelling", "Content", "Digital Media"],
      likes: 156,
      comments: 31,
      image: "/placeholder.svg"
    },
    {
      id: 4,
      title: "Cybersecurity Best Practices for Small Businesses",
      excerpt: "Essential security measures every small business should implement to protect against cyber threats and data breaches in today's digital landscape.",
      content: "Small businesses are increasingly becoming targets for cybercriminals, often because they lack the robust security infrastructure of larger corporations. However, implementing basic cybersecurity measures can significantly reduce the risk of data breaches and cyber attacks. This includes regular software updates, employee training on phishing recognition, multi-factor authentication, and regular data backups. The cost of prevention is always less than the cost of recovery from a cyber attack. By establishing a security-first culture and implementing these best practices, small businesses can protect themselves and their customers while building trust and credibility in the marketplace.",
      author: {
        name: "David Kim",
        avatar: "/placeholder.svg",
        role: "Security Analyst"
      },
      publishedAt: "2025-01-08",
      readTime: "10 min read",
      category: "Security",
      tags: ["Cybersecurity", "Business", "Data Protection"],
      likes: 203,
      comments: 15,
      image: "/placeholder.svg"
    }
  ]);

  const categories = ["All", "Technology", "Business", "Creative", "Security"];

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleLike = (id: number) => {
    setBlogPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
    toast({
      title: "Liked!",
      description: "Thanks for liking this post!",
    });
  };

  const handleReadMore = (post: any) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            UniVerse Blog
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Insights, tutorials, and stories from our community of innovators
          </p>
        </div>

        {/* Search and Categories */}
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 max-w-md mx-auto"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-12">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <img
                  src={filteredPosts[0].image}
                  alt={filteredPosts[0].title}
                  className="w-full h-64 md:h-full object-cover rounded-l-lg"
                />
                <Badge className="absolute top-4 left-4 bg-purple-500/80 text-white">
                  Featured
                </Badge>
              </div>
              <CardContent className="p-6">
                <Badge className="mb-3 bg-blue-500/80 text-white">
                  {filteredPosts[0].category}
                </Badge>
                <CardTitle className="text-2xl text-white mb-3">
                  {filteredPosts[0].title}
                </CardTitle>
                <CardDescription className="text-white/70 mb-4">
                  {filteredPosts[0].excerpt}
                </CardDescription>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={filteredPosts[0].author.avatar} />
                      <AvatarFallback>{filteredPosts[0].author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white text-sm font-medium">{filteredPosts[0].author.name}</p>
                      <p className="text-white/60 text-xs">{filteredPosts[0].author.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-white/60 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(filteredPosts[0].publishedAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {filteredPosts[0].readTime}
                    </span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleReadMore(filteredPosts[0])}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  Read More
                </Button>
              </CardContent>
            </div>
          </Card>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.slice(1).map((post) => (
            <BlogCard 
              key={post.id} 
              post={post} 
              onLike={handleLike}
              onReadMore={handleReadMore}
            />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/70 text-lg">No articles found matching your search.</p>
          </div>
        )}
      </div>

      <BlogModal 
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLike={handleLike}
      />
    </div>
  );
};

export default Blog;
