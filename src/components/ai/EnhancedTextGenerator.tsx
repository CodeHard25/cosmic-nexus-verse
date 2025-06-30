
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Copy, Download } from 'lucide-react';

export const EnhancedTextGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generationType, setGenerationType] = useState('text');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('openai-text-generation', {
        body: { prompt, type: generationType }
      });

      if (error) throw error;

      setResult(data.generatedText);
      toast({
        title: "Success",
        description: "Content generated successfully!"
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied",
      description: "Content copied to clipboard"
    });
  };

  const downloadResult = () => {
    const element = document.createElement('a');
    const file = new Blob([result], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `generated_${generationType}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            AI Content Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-white text-sm font-medium mb-2 block">Generation Type</label>
            <Select value={generationType} onValueChange={setGenerationType}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="text">Text Content</SelectItem>
                <SelectItem value="code">Code Generation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-white text-sm font-medium mb-2 block">Your Prompt</label>
            <Textarea
              placeholder={
                generationType === 'code' 
                  ? "Describe the code you want to generate (e.g., 'Create a React component for a user profile card')"
                  : "Enter your prompt here (e.g., 'Write a blog post about AI in healthcare')"
              }
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-32"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            {loading ? "Generating..." : "Generate Content"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Generated Content</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={downloadResult}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-black/20 rounded-lg p-4">
              <pre className="text-white whitespace-pre-wrap font-mono text-sm">{result}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
