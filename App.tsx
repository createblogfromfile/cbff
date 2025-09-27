import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FileCard from './components/FileCard';
import MarkdownViewer from './components/MarkdownViewer';
import { parseMarkdownFile } from './utils/markdownParser';
import { ParsedMarkdown } from './types';
import { Theme } from './types';

// This component includes all possible theme color classes in a hidden div.
// This ensures Tailwind's JIT compiler generates the CSS for these dynamic classes.
const TailwindSafelist: React.FC = () => (
  <div className="hidden">
    {/* Default Dark Theme */}
    <span className="bg-gray-900 text-gray-100 border-gray-700 focus:ring-offset-gray-900"></span>
    <span className="bg-gray-800 text-gray-400"></span>
    <span className="text-sky-500 border-sky-500 shadow-sky-500/20 focus:ring-sky-500 bg-sky-500 hover:bg-sky-600"></span>
    
    {/* Classic Light Theme */}
    <span className="bg-white text-gray-800 border-gray-200 focus:ring-offset-white"></span>
    <span className="bg-gray-100 text-gray-600"></span>
    <span className="text-blue-600 border-blue-600 shadow-blue-600/20 focus:ring-blue-600 bg-blue-600 hover:bg-blue-700"></span>

    {/* Solarized Theme */}
    <span className="bg-slate-800 text-slate-100 border-slate-600 focus:ring-offset-slate-800"></span>
    <span className="bg-slate-700 text-slate-400"></span>
    <span className="text-yellow-400 border-yellow-400 shadow-yellow-400/20 focus:ring-yellow-400 bg-yellow-400 hover:bg-yellow-500"></span>

    {/* Forest Theme */}
    <span className="bg-gray-900 text-gray-200 border-gray-700 focus:ring-offset-gray-900"></span>
    <span className="bg-gray-800 text-gray-400"></span>
    <span className="text-emerald-500 border-emerald-500 shadow-emerald-500/20 focus:ring-emerald-500 bg-emerald-500 hover:bg-emerald-600"></span>

    {/* Rose Pine Theme */}
    <span className="bg-zinc-900 text-zinc-100 border-zinc-700 focus:ring-offset-zinc-900"></span>
    <span className="bg-zinc-800 text-zinc-400"></span>
    <span className="text-rose-400 border-rose-400 shadow-rose-400/20 focus:ring-rose-400 bg-rose-400 hover:bg-rose-500"></span>
  </div>
);


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
        
        // Fetch theme and file manifest in parallel using absolute paths
        const [themeResponse, manifestResponse] = await Promise.all([
          fetch('/ui.json'),
          fetch('/md/file-manifest.json')
        ]);

        if (!themeResponse.ok) throw new Error('Failed to fetch ui.json');
        if (!manifestResponse.ok) throw new Error('Could not find md/file-manifest.json. Make sure it exists.');
        
        const themeData: Theme = await themeResponse.json();
        const fileNames: string[] = await manifestResponse.json();

        setTheme(themeData);

        // Fetch all markdown files based on the manifest
        const articlePromises = fileNames.map(fileName =>
          fetch(`/md/${fileName}`) // Use absolute path
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
      <TailwindSafelist />
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
