
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FileText, Eye, Edit, Trash2, CheckCircle } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  published: boolean;
  featured: boolean;
  created_at: string;
  author: {
    full_name: string;
  };
}

export const BlogManagement = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      // Use untyped query since blogs table isn't in types yet
      const { data, error } = await (supabase as any)
        .from('blogs')
        .select(`
          id,
          title,
          excerpt,
          published,
          featured,
          created_at,
          profiles!blogs_author_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching blogs:', error);
        // Set empty array if table doesn't exist yet
        setBlogs([]);
        setLoading(false);
        return;
      }

      const formattedBlogs = data?.map((blog: any) => ({
        id: blog.id,
        title: blog.title,
        excerpt: blog.excerpt,
        published: blog.published,
        featured: blog.featured,
        created_at: blog.created_at,
        author: {
          full_name: blog.profiles?.full_name || 'Unknown Author'
        }
      })) || [];

      setBlogs(formattedBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
      toast({
        title: "Info",
        description: "Blog management will be available once blogs are created",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePublished = async (blogId: string, currentStatus: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from('blogs')
        .update({ published: !currentStatus })
        .eq('id', blogId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Blog post ${!currentStatus ? 'published' : 'unpublished'}`
      });

      fetchBlogs();
    } catch (error) {
      console.error('Error updating blog:', error);
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive"
      });
    }
  };

  const deleteBlog = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const { error } = await (supabase as any)
        .from('blogs')
        .delete()
        .eq('id', blogId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post deleted successfully"
      });

      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-6">
          <div className="text-center text-white">Loading blog posts...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Blog Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-white font-medium">{blog.title}</h3>
                  {blog.featured && (
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                      Featured
                    </Badge>
                  )}
                  <Badge 
                    variant={blog.published ? "default" : "outline"}
                    className={blog.published ? "bg-green-500/20 text-green-300" : ""}
                  >
                    {blog.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <p className="text-white/70 text-sm mb-2">{blog.excerpt}</p>
                <p className="text-white/50 text-xs">
                  By {blog.author.full_name} • {new Date(blog.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => togglePublished(blog.id, blog.published)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  {blog.published ? (
                    <>
                      <Eye className="w-4 h-4 mr-1" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Publish
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteBlog(blog.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {blogs.length === 0 && (
            <div className="text-center text-white/60 py-8">
              No blog posts found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
