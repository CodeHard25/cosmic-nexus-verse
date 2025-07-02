
import { CreateBlogModal } from "./CreateBlogModal";

interface BlogHeaderProps {
  user: any;
  onBlogCreated: () => void;
}

const BlogHeader = ({ user, onBlogCreated }: BlogHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
        UniVerse Blog
      </h1>
      <p className="text-xl text-white/70 max-w-2xl mx-auto mb-6">
        Insights, tutorials, and stories from our community of innovators
      </p>
      {user && (
        <CreateBlogModal onBlogCreated={onBlogCreated} />
      )}
    </div>
  );
};

export default BlogHeader;
