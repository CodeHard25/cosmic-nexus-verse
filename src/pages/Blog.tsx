
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Calendar, User, MessageCircle, Heart, BookOpen } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock blog data
  const blogPosts = [
    {
      id: 1,
      title: "The Future of AI in Creative Industries",
      excerpt: "Exploring how artificial intelligence is revolutionizing creative workflows and empowering artists, writers, and designers to push the boundaries of innovation.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
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
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
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
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
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
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
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
  ];

  const categories = ["All", "Technology", "Business", "Creative", "Security"];

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                  Read More
                </Button>
              </CardContent>
            </div>
          </Card>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.slice(1).map((post) => (
            <Card key={post.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardHeader className="p-0">
                <div className="relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-2 left-2 bg-blue-500/80 text-white">
                    {post.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-white mb-2 line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="text-white/70 mb-3 line-clamp-3">
                  {post.excerpt}
                </CardDescription>
                
                <div className="flex items-center gap-2 mb-3">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback className="text-xs">{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-white/80 text-sm">{post.author.name}</span>
                </div>

                <div className="flex items-center justify-between text-white/60 text-sm mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </span>
                  <span>{post.readTime}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-white/60 text-sm">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                    Read More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/70 text-lg">No articles found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
