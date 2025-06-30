import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Bot, FileText, Code, Image, TrendingUp } from 'lucide-react';

interface AIStats {
  totalGenerations: number;
  textGenerations: number;
  codeGenerations: number;
  imageGenerations: number;
  totalTokens: number;
}

export const AIUsageStats = () => {
  const [stats, setStats] = useState<AIStats>({
    totalGenerations: 0,
    textGenerations: 0,
    codeGenerations: 0,
    imageGenerations: 0,
    totalTokens: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_generations')
        .select('type, tokens_used');

      if (error) {
        console.error('Error fetching AI stats:', error);
        setStats({
          totalGenerations: 0,
          textGenerations: 0,
          codeGenerations: 0,
          imageGenerations: 0,
          totalTokens: 0
        });
        setLoading(false);
        return;
      }

      const totalGenerations = data?.length || 0;
      const textGenerations = data?.filter((g: any) => g.type === 'text').length || 0;
      const codeGenerations = data?.filter((g: any) => g.type === 'code').length || 0;
      const imageGenerations = data?.filter((g: any) => g.type === 'image').length || 0;
      const totalTokens = data?.reduce((sum: number, g: any) => sum + (g.tokens_used || 0), 0) || 0;

      setStats({
        totalGenerations,
        textGenerations,
        codeGenerations,
        imageGenerations,
        totalTokens
      });
    } catch (error) {
      console.error('Error fetching AI stats:', error);
      setStats({
        totalGenerations: 0,
        textGenerations: 0,
        codeGenerations: 0,
        imageGenerations: 0,
        totalTokens: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Generations',
      value: stats.totalGenerations,
      icon: Bot,
      color: 'from-purple-500 to-blue-500'
    },
    {
      title: 'Text Generations',
      value: stats.textGenerations,
      icon: FileText,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Code Generations',
      value: stats.codeGenerations,
      icon: Code,
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Image Generations',
      value: stats.imageGenerations,
      icon: Image,
      color: 'from-pink-500 to-rose-500'
    }
  ];

  if (loading) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-6">
          <div className="text-center text-white">Loading AI usage stats...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Token Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl font-bold text-white mb-2">{stats.totalTokens.toLocaleString()}</div>
            <p className="text-white/70">Total tokens consumed</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
