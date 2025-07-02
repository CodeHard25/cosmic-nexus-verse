
import BlogCard from "./BlogCard";

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

interface BlogPostsGridProps {
  posts: BlogPost[];
  onLike: (id: string) => void;
  onReadMore: (post: BlogPost) => void;
}

const BlogPostsGrid = ({ posts, onLike, onReadMore }: BlogPostsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard 
          key={post.id} 
          post={{
            id: parseInt(post.id.replace(/-/g, '').substring(0, 8), 16),
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
          onLike={() => onLike(post.id)}
          onReadMore={() => onReadMore(post)}
        />
      ))}
    </div>
  );
};

export default BlogPostsGrid;
