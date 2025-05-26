
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Search, Filter, Star, Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useNavigate } from "react-router-dom";

const Shop = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock product data
  const products = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 299.99,
      image: "/placeholder.svg",
      category: "Electronics",
      rating: 4.8,
      reviews: 234,
      description: "High-quality wireless headphones with noise cancellation"
    },
    {
      id: 2,
      name: "Organic Cotton T-Shirt",
      price: 29.99,
      image: "/placeholder.svg",
      category: "Fashion",
      rating: 4.5,
      reviews: 89,
      description: "Comfortable organic cotton t-shirt available in multiple colors"
    },
    {
      id: 3,
      name: "Smart Fitness Watch",
      price: 199.99,
      image: "/placeholder.svg",
      category: "Electronics",
      rating: 4.7,
      reviews: 156,
      description: "Track your fitness goals with this advanced smartwatch"
    },
    {
      id: 4,
      name: "Artisan Coffee Beans",
      price: 24.99,
      image: "/placeholder.svg",
      category: "Food",
      rating: 4.9,
      reviews: 67,
      description: "Premium single-origin coffee beans roasted to perfection"
    },
    {
      id: 5,
      name: "Minimalist Backpack",
      price: 89.99,
      image: "/placeholder.svg",
      category: "Fashion",
      rating: 4.6,
      reviews: 123,
      description: "Sleek and functional backpack for modern professionals"
    },
    {
      id: 6,
      name: "Plant-Based Protein Powder",
      price: 39.99,
      image: "/placeholder.svg",
      category: "Health",
      rating: 4.4,
      reviews: 78,
      description: "Organic plant-based protein powder with natural flavors"
    }
  ];

  const categories = ["all", "Electronics", "Fashion", "Food", "Health"];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            UniVerse Shop
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Discover amazing products curated by our community of creators
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="text-white">
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardHeader className="p-0">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm hover:bg-black/40"
                  >
                    <Heart className="w-4 h-4 text-white" />
                  </Button>
                  <Badge className="absolute top-2 left-2 bg-purple-500/80 text-white">
                    {product.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-white mb-2">{product.name}</CardTitle>
                <CardDescription className="text-white/70 mb-3">
                  {product.description}
                </CardDescription>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-white/80 ml-1">{product.rating}</span>
                  </div>
                  <span className="text-white/60">({product.reviews} reviews)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">${product.price}</span>
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/70 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
