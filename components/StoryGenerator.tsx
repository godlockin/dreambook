import React, { useState } from 'react';
import { ImageSize, GenerationState } from '../types';
import { refinePromptWithStyle, generateIllustration } from '../services/geminiService';

const StoryGenerator: React.FC = () => {
  const [bookTitle, setBookTitle] = useState('');
  const [story, setStory] = useState('');
  const [imageSize, setImageSize] = useState<ImageSize>(ImageSize.Size1K);
  const [generationState, setGenerationState] = useState<GenerationState>({ status: 'idle' });
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [refinedPrompt, setRefinedPrompt] = useState<string>('');

  const handleGenerate = async () => {
    if (!bookTitle.trim() || !story.trim()) return;

    setGenerationState({ status: 'searching', message: 'Searching for book style...' });
    setResultImage(null);
    setRefinedPrompt('');

    try {
      // Step 1: Refine Prompt
      const refined = await refinePromptWithStyle(bookTitle, story);
      setRefinedPrompt(refined);
      
      setGenerationState({ status: 'generating', message: 'Painting your masterpiece...' });
      
      // Step 2: Generate Image
      const imageUrl = await generateIllustration(refined, imageSize);
      setResultImage(imageUrl);
      
      setGenerationState({ status: 'complete' });
    } catch (error: any) {
      setGenerationState({ 
        status: 'error', 
        message: error.message || 'Something went wrong. Please try again!' 
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-sky-200">
        
        {/* Header */}
        <div className="bg-sky-400 p-6 text-center">
          <h1 className="text-3xl font-bold text-white tracking-wide drop-shadow-md">
             Magic Illustrator 
          </h1>
          <p className="text-sky-100 mt-2 text-lg">Turn your stories into picture book art!</p>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: Controls */}
          <div className="space-y-6">
            
            {/* Book Title Input */}
            <div className="space-y-2">
              <label className="block text-sky-700 font-bold text-lg ml-1">
                1. Which Picture Book? 📖
              </label>
              <input 
                type="text"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                placeholder="e.g. The Very Hungry Caterpillar"
                className="w-full p-4 rounded-2xl bg-sky-50 border-2 border-sky-100 focus:border-pink-400 focus:ring-0 focus:outline-none text-lg transition-colors placeholder-sky-300 text-sky-900"
              />
            </div>

            {/* Story Input */}
            <div className="space-y-2">
              <label className="block text-sky-700 font-bold text-lg ml-1">
                2. Your Story Idea ✍️
              </label>
              <textarea 
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="e.g. The caterpillar found a giant pizza and ate the whole thing!"
                rows={4}
                className="w-full p-4 rounded-2xl bg-sky-50 border-2 border-sky-100 focus:border-pink-400 focus:ring-0 focus:outline-none text-lg transition-colors placeholder-sky-300 text-sky-900 resize-none"
              />
            </div>

            {/* Quality Selector */}
            <div className="space-y-2">
              <label className="block text-sky-700 font-bold text-lg ml-1">
                3. Image Quality 🖼️
              </label>
              <div className="flex gap-2 bg-sky-50 p-2 rounded-2xl border-2 border-sky-100">
                {Object.values(ImageSize).map((size) => (
                  <button
                    key={size}
                    onClick={() => setImageSize(size)}
                    className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                      imageSize === size
                        ? 'bg-pink-500 text-white shadow-md transform scale-105'
                        : 'text-sky-400 hover:bg-sky-100'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleGenerate}
              disabled={generationState.status === 'searching' || generationState.status === 'generating'}
              className={`w-full py-4 rounded-2xl font-bold text-xl text-white shadow-lg transition-all transform active:scale-95 ${
                generationState.status === 'searching' || generationState.status === 'generating'
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 hover:shadow-pink-200/50'
              }`}
            >
              {generationState.status === 'searching' ? 'Searching...' : 
               generationState.status === 'generating' ? 'Painting...' : 
               'Create Magic! ✨'}
            </button>
            
            {/* Status Messages */}
            {generationState.status !== 'idle' && generationState.status !== 'complete' && (
              <div className="text-center animate-pulse text-sky-600 font-medium">
                {generationState.message}
              </div>
            )}
            
            {generationState.error && (
              <div className="p-4 bg-red-50 text-red-500 rounded-xl border border-red-100 text-center">
                {generationState.error}
              </div>
            )}

          </div>

          {/* Right Column: Result */}
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-sky-50 rounded-3xl border-2 border-dashed border-sky-200 relative overflow-hidden group">
            
            {resultImage ? (
              <>
                <img 
                  src={resultImage} 
                  alt="Generated illustration" 
                  className="w-full h-full object-contain rounded-2xl shadow-md animate-fade-in"
                />
                <a 
                  href={resultImage} 
                  download="magic-illustration.png"
                  className="absolute bottom-4 right-4 bg-white/90 text-sky-600 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  title="Download"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              </>
            ) : (
              <div className="text-center text-sky-300 p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium">Your illustration will appear here</p>
              </div>
            )}
            
          </div>
        </div>

        {/* Refined Prompt Debug/Info (Optional, visible for education/fun) */}
        {refinedPrompt && (
          <div className="bg-slate-50 p-4 border-t border-slate-100 text-xs text-slate-500 overflow-hidden whitespace-nowrap text-ellipsis">
             <span className="font-bold">AI Secret Recipe:</span> {refinedPrompt}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryGenerator;