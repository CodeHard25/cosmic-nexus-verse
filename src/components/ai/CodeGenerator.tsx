
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code, RefreshCw, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CodeGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const codeTemplates = {
    javascript: {
      function: `// Generated JavaScript function for: {{prompt}}
function {{functionName}}() {
  console.log('Hello, World!');
  
  // Main logic here
  const result = processData();
  
  return result;
}

function processData() {
  // Implementation details
  return 'Processed data';
}

// Usage example
const output = {{functionName}}();
console.log(output);`,
      
      react: `// Generated React component for: {{prompt}}
import React, { useState, useEffect } from 'react';

const {{componentName}} = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data or initialize component
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setData('Sample data');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>{{componentName}}</h1>
      <p>{data}</p>
    </div>
  );
};

export default {{componentName}};`
    },
    
    python: {
      function: `# Generated Python code for: {{prompt}}
def {{function_name}}():
    """
    Main function to handle the requested functionality.
    """
    print("Hello, World!")
    
    # Main logic here
    result = process_data()
    
    return result

def process_data():
    """
    Helper function to process data.
    """
    # Implementation details
    return "Processed data"

# Usage example
if __name__ == "__main__":
    output = {{function_name}}()
    print(f"Result: {output}")`,
    
      class: `# Generated Python class for: {{prompt}}
class {{ClassName}}:
    def __init__(self):
        self.data = []
        self.initialized = True
    
    def add_item(self, item):
        """Add an item to the collection."""
        self.data.append(item)
        return len(self.data)
    
    def get_items(self):
        """Retrieve all items."""
        return self.data.copy()
    
    def process(self):
        """Process the collected items."""
        processed = [str(item).upper() for item in self.data]
        return processed

# Usage example
instance = {{ClassName}}()
instance.add_item("example")
result = instance.process()
print(result)`
    }
  };

  const generateCode = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      const templates = codeTemplates[language as keyof typeof codeTemplates];
      const templateKeys = Object.keys(templates);
      const randomTemplate = templates[templateKeys[Math.floor(Math.random() * templateKeys.length)] as keyof typeof templates];
      
      // Generate function/component name from prompt
      const cleanPrompt = prompt.replace(/[^a-zA-Z0-9\s]/g, '').trim();
      const words = cleanPrompt.split(' ').filter(word => word.length > 0);
      const functionName = words.length > 0 
        ? words.map((word, index) => 
            index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join('')
        : 'generatedFunction';
      
      const componentName = words.length > 0
        ? words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('')
        : 'GeneratedComponent';
      
      const className = componentName;
      const function_name = functionName.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      
      let code = randomTemplate
        .replace(/\{\{prompt\}\}/g, prompt)
        .replace(/\{\{functionName\}\}/g, functionName)
        .replace(/\{\{componentName\}\}/g, componentName)
        .replace(/\{\{ClassName\}\}/g, className)
        .replace(/\{\{function_name\}\}/g, function_name);
      
      setGeneratedCode(code);
      setIsGenerating(false);
      
      toast({
        title: "Code Generated!",
        description: `${language} code has been generated successfully.`,
      });
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard.",
    });
  };

  const downloadCode = () => {
    const extensions = {
      javascript: 'js',
      python: 'py',
      react: 'jsx',
      typescript: 'ts'
    };
    
    const extension = extensions[language as keyof typeof extensions] || 'txt';
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-code.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Code file downloaded successfully.",
    });
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Code className="w-5 h-5" />
          AI Code Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Describe the code you need..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          rows={3}
        />
        
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="javascript" className="text-white">JavaScript</SelectItem>
            <SelectItem value="python" className="text-white">Python</SelectItem>
            <SelectItem value="react" className="text-white">React/JSX</SelectItem>
            <SelectItem value="typescript" className="text-white">TypeScript</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          onClick={generateCode}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating Code...
            </>
          ) : (
            <>
              <Code className="w-4 h-4 mr-2" />
              Generate Code
            </>
          )}
        </Button>
        
        {generatedCode && (
          <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-medium">Generated Code</h4>
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
                  onClick={downloadCode}
                  className="bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <pre className="text-white/80 text-sm whitespace-pre-wrap overflow-x-auto bg-black/20 p-3 rounded">
              <code>{generatedCode}</code>
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CodeGenerator;
