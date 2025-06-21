
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, RefreshCw, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TextGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateText = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI text generation
    setTimeout(() => {
      const responses = [
        `Based on your prompt "${prompt}", here's a generated response:\n\nThis is a comprehensive exploration of the topic you've requested. The subject matter presents numerous fascinating aspects that deserve careful consideration. Through innovative approaches and creative thinking, we can develop solutions that address the core challenges while maintaining focus on practical implementation.\n\nKey points to consider:\n- Strategic planning and execution\n- Creative problem-solving methodologies\n- Sustainable and scalable solutions\n- User-centered design principles\n\nThe integration of these elements creates a framework for success that can be adapted to various scenarios and requirements.`,
        
        `Regarding "${prompt}":\n\nIn today's rapidly evolving landscape, this topic has gained significant importance across multiple industries and sectors. The interconnected nature of modern challenges requires holistic approaches that consider both immediate needs and long-term implications.\n\nConsiderations include:\n1. Market dynamics and trends\n2. Technological advancement opportunities\n3. Stakeholder engagement strategies\n4. Risk assessment and mitigation\n\nBy addressing these fundamental aspects, we can create meaningful impact and drive positive change in the relevant ecosystem.`,
        
        `Your request about "${prompt}" opens up interesting possibilities:\n\nThe convergence of technology, creativity, and human insight creates unique opportunities for innovation. This multifaceted approach allows for the development of solutions that are both technically sound and creatively inspired.\n\nEssential elements:\n• Research-backed methodologies\n• Creative ideation processes\n• Iterative development cycles\n• Community feedback integration\n\nThese components work together to ensure that the final outcome meets both functional requirements and user expectations.`
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setGeneratedText(randomResponse);
      setIsGenerating(false);
      
      toast({
        title: "Text Generated!",
        description: "Your content has been generated successfully.",
      });
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard.",
    });
  };

  const downloadText = () => {
    const blob = new Blob([generatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Text file downloaded successfully.",
    });
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          AI Text Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Describe what you want to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          rows={4}
        />
        <Button 
          onClick={generateText}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Text
            </>
          )}
        </Button>
        
        {generatedText && (
          <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-medium">Generated Content</h4>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={copyToClipboard}
                  className="bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={downloadText}
                  className="bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <pre className="text-white/80 text-sm whitespace-pre-wrap">{generatedText}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TextGenerator;
