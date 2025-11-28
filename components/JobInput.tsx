import React, { useState } from 'react';
import { Clipboard, ArrowRight, Briefcase } from 'lucide-react';

interface JobInputProps {
  onAnalyze: (jd: string) => void;
  isLoading: boolean;
}

export const JobInput: React.FC<JobInputProps> = ({ onAnalyze, isLoading }) => {
  const [jdText, setJdText] = useState('');

  const handleAnalyze = () => {
    if (jdText.trim()) {
      onAnalyze(jdText);
    }
  };

  const fillExample = () => {
    const exampleJD = `Senior Frontend Engineer
    
We are looking for an experienced Frontend Engineer to join our product team.
    
Responsibilities:
- Build high-quality, responsive web applications using React and TypeScript.
- Collaborate with designers and backend engineers.
- Optimize application for maximum speed and scalability.
    
Requirements:
- 5+ years of experience in web development.
- Strong proficiency in JavaScript, TypeScript, and React (Hooks, Context).
- Experience with Tailwind CSS.
- Familiarity with modern build pipelines (Vite, Webpack).
- Good communication skills and ability to work in a remote team.
- Bonus: Experience with AI/LLM integration.
    
Location: Remote (US/Canada preferred)`;
    setJdText(exampleJD);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Briefcase className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Step 1: The Role</h2>
            <p className="text-slate-500">Paste your Job Description (JD) to start the sourcing agent.</p>
          </div>
        </div>

        <div className="relative">
          <textarea
            className="w-full h-64 p-4 text-slate-700 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all font-mono text-sm"
            placeholder="Paste Job Description here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            disabled={isLoading}
          />
          <button 
            onClick={fillExample}
            className="absolute top-4 right-4 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full transition-colors"
          >
            Auto-fill Example
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={!jdText.trim() || isLoading}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all transform active:scale-95 ${
              !jdText.trim() || isLoading
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>Create Persona</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};