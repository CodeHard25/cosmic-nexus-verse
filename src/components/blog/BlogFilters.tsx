
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface BlogFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  categories: string[];
}

const BlogFilters = ({ searchTerm, onSearchChange, categories }: BlogFiltersProps) => {
  return (
    <div className="mb-8">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
        <Input
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
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
  );
};

export default BlogFilters;
