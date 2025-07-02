
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import BlogModal from "@/components/blog/BlogModal";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFilters from "@/components/blog/BlogFilters";
import FeaturedBlogCard from "@/components/blog/FeaturedBlogCard";
import BlogPostsGrid from "@/components/blog/BlogPostsGrid";

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
        likes: Math.floor(Math.random() * 300) + 50,
        comments: Math.floor(Math.random() * 50) + 5,
        readTime: `${Math.floor(blog.content.length / 200) + 1} min read`,
        category: "Technology",
        tags: ["Blog", "Community"],
        image: "/placeholder.svg"
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
        <BlogHeader user={user} onBlogCreated={fetchBlogs} />
        
        <BlogFilters 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categories={categories}
        />

        {filteredPosts.length > 0 && filteredPosts[0].featured && (
          <FeaturedBlogCard 
            post={filteredPosts[0]}
            onReadMore={handleReadMore}
          />
        )}

        <BlogPostsGrid 
          posts={filteredPosts.slice(filteredPosts[0]?.featured ? 1 : 0)}
          onLike={handleLike}
          onReadMore={handleReadMore}
        />

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
