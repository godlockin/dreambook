import React, { useEffect } from 'react';
import StoryGenerator from './components/StoryGenerator';
import ChatBot from './components/ChatBot';
import { ensureApiKey } from './services/geminiUtils';

const App: React.FC = () => {
  
  useEffect(() => {
    // Pre-check API key on mount if possible, though specific features check on demand.
    // This ensures the "Get Started" friction happens early if needed.
    ensureApiKey();
  }, []);

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1503455637927-730bce8583c0?auto=format&fit=crop&q=80&w=2070&opacity=0.1")' }}>
      <div className="min-h-screen bg-white/60 backdrop-blur-sm flex flex-col items-center py-10">
        
        {/* Top Navigation / Logo */}
        <div className="w-full max-w-6xl px-6 flex justify-between items-center mb-8">
           <div className="flex items-center gap-3">
             <div className="bg-pink-500 p-2 rounded-xl text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
             </div>
             <span className="font-fredoka font-bold text-2xl text-slate-700 tracking-tight">DreamBook</span>
           </div>
           
           <div className="text-sm text-slate-500 font-medium bg-white/80 px-4 py-2 rounded-full shadow-sm border border-white">
             Powered by Gemini 3 Pro
           </div>
        </div>

        {/* Main Content */}
        <main className="w-full px-4">
          <StoryGenerator />
        </main>

        {/* Footer */}
        <footer className="mt-auto py-6 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} DreamBook Illustrator. Magic for Kids.</p>
        </footer>

        {/* Chat Overlay */}
        <ChatBot />

      </div>
    </div>
  );
};

export default App;
