
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Calendar, BookOpen } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import BlogCard from "@/components/blog/BlogCard";
import BlogModal from "@/components/blog/BlogModal";
import { CreateBlogModal } from "@/components/blog/CreateBlogModal";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  published: boolean;
  featured: boolean;
  created_at: string;
  author: {
    full_name: string;
    avatar_url?: string;
  };
  likes: number;
  comments: number;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  publishedAt: string;
}

const Blog = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const categories = ["All", "Technology", "Business", "Creative", "Security"];

  const fetchBlogs = async () => {
    try {
      const { data: blogsData, error: blogsError } = await supabase
        .from('blogs')
        .select(`
          id,
          title,
          excerpt,
          content,
          published,
          featured,
          created_at,
          profiles!blogs_author_id_fkey(full_name, avatar_url)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (blogsError) throw blogsError;

      const formattedBlogs = blogsData?.map((blog: any) => ({
        id: blog.id,
        title: blog.title,
        excerpt: blog.excerpt || blog.content.substring(0, 200) + '...',
        content: blog.content,
        published: blog.published,
        featured: blog.featured,
        created_at: blog.created_at,
        publishedAt: blog.created_at,
        author: {
          full_name: blog.profiles?.full_name || 'Unknown Author',
          avatar_url: blog.profiles?.avatar_url
        },
        likes: Math.floor(Math.random() * 300) + 50, // Mock data for now
        comments: Math.floor(Math.random() * 50) + 5, // Mock data for now
        readTime: `${Math.floor(blog.content.length / 200) + 1} min read`,
        category: "Technology", // Mock data for now
        tags: ["Blog", "Community"], // Mock data for now
        image: "/placeholder.svg" // Mock data for now
      })) || [];

      setBlogPosts(formattedBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLike = (id: string) => {
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

  const handleReadMore = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center text-white">Loading blogs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            UniVerse Blog
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-6">
            Insights, tutorials, and stories from our community of innovators
          </p>
          {user && (
            <CreateBlogModal onBlogCreated={fetchBlogs} />
          )}
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
        {filteredPosts.length > 0 && filteredPosts[0].featured && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-12">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <img
                  src="/placeholder.svg"
                  alt={filteredPosts[0].title}
                  className="w-full h-64 md:h-full object-cover rounded-l-lg"
                />
                <Badge className="absolute top-4 left-4 bg-purple-500/80 text-white">
                  Featured
                </Badge>
              </div>
              <CardContent className="p-6">
                <Badge className="mb-3 bg-blue-500/80 text-white">
                  Technology
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
                      <AvatarImage src={filteredPosts[0].author.avatar_url} />
                      <AvatarFallback>{filteredPosts[0].author.full_name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white text-sm font-medium">{filteredPosts[0].author.full_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-white/60 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(filteredPosts[0].created_at).toLocaleDateString()}
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
          {filteredPosts.slice(filteredPosts[0]?.featured ? 1 : 0).map((post) => (
            <BlogCard 
              key={post.id} 
              post={{
                id: parseInt(post.id), // Convert to number for BlogCard
                title: post.title,
                excerpt: post.excerpt,
                content: post.content,
                author: {
                  name: post.author.full_name,
                  avatar: post.author.avatar_url || "/placeholder.svg",
                  role: "Community Member"
                },
                publishedAt: post.publishedAt,
                readTime: post.readTime,
                category: post.category,
                tags: post.tags,
                likes: post.likes,
                comments: post.comments,
                image: post.image
              }}
              onLike={() => handleLike(post.id)}
              onReadMore={() => handleReadMore(post)}
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
        onLike={() => selectedPost && handleLike(selectedPost.id)}
      />
    </div>
  );
};

export default Blog;
