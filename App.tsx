import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FileCard from './components/FileCard';
import MarkdownViewer from './components/MarkdownViewer';
import { parseMarkdownFile } from './utils/markdownParser';
import { ParsedMarkdown } from './types';
import { Theme } from './types';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<ParsedMarkdown | null>(null);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [articles, setArticles] = useState<ParsedMarkdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch theme and file manifest in parallel
        const [themeResponse, manifestResponse] = await Promise.all([
          fetch('./ui.json'),
          fetch('./md/file-manifest.json')
        ]);

        if (!themeResponse.ok) throw new Error('Failed to fetch ui.json');
        if (!manifestResponse.ok) throw new Error('Could not find md/file-manifest.json');
        
        const themeData: Theme = await themeResponse.json();
        const fileNames: string[] = await manifestResponse.json();

        setTheme(themeData);

        // Fetch all markdown files based on the manifest
        const articlePromises = fileNames.map(fileName =>
          fetch(`./md/${fileName}`)
            .then(res => {
              if (!res.ok) throw new Error(`Failed to load ${fileName}`);
              return res.text();
            })
            .then(content => parseMarkdownFile(fileName, content))
        );
        
        const loadedArticles = await Promise.all(articlePromises);
        setArticles(loadedArticles);

      } catch (err: any) {
        console.error("Failed to load application data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if (theme) {
      document.body.className = `bg-${theme.colors.background} text-${theme.colors.textPrimary} transition-colors duration-500`;
    }
  }, [theme]);

  const handleSelectFile = (file: ParsedMarkdown) => {
    setSelectedFile(file);
    window.scrollTo(0, 0);
  };

  const handleGoBack = () => {
    setSelectedFile(null);
  };

  if (loading || !theme) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100">
        <p>{loading ? 'Loading articles...' : 'Loading theme...'}</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-900 text-white p-8">
        <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Error</h1>
            <p>Could not load blog data. Please check the console for details.</p>
            <pre className="mt-4 p-4 bg-red-800 rounded-md text-left text-sm">{error}</pre>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen">
      <Header theme={theme} />
      <main>
        {selectedFile ? (
          <MarkdownViewer file={selectedFile} theme={theme} onBack={handleGoBack} />
        ) : (
          <div className="p-8 max-w-7xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 px-2">Available Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(file => (
                <FileCard
                  key={file.title}
                  file={file}
                  theme={theme}
                  onClick={() => handleSelectFile(file)}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
