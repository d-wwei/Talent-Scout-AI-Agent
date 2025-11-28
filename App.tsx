import React, { useState } from 'react';
import { JobInput } from './components/JobInput';
import { PersonaReview } from './components/PersonaReview';
import { AgentStatus } from './components/AgentStatus';
import { CandidateList } from './components/CandidateList';
import { CandidatePersona, CandidateProfile, AppStep } from './types';
import { analyzeJobDescription, findCandidates } from './services/geminiService';
import { Bot, ChevronRight, UserCircle } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.INPUT_JD);
  const [persona, setPersona] = useState<CandidatePersona | null>(null);
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [shortlist, setShortlist] = useState<CandidateProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeJD = async (jd: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeJobDescription(jd);
      setPersona(result);
      setStep(AppStep.REVIEW_PERSONA);
    } catch (err) {
      setError("Failed to analyze Job Description. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPersona = async (finalPersona: CandidatePersona) => {
    setPersona(finalPersona); // Update with any edits
    setStep(AppStep.SEARCHING);
    
    // Simulate searching delay for effect, then call API
    // The visual AgentStatus component handles the animation
    setTimeout(async () => {
        try {
            const results = await findCandidates(finalPersona);
            setCandidates(results);
            setStep(AppStep.RESULTS);
        } catch (err) {
            setError("Failed to search candidates.");
            setStep(AppStep.REVIEW_PERSONA); // Go back if fail
        }
    }, 4500); // 4.5 seconds to allow the agent animations to play out a bit
  };

  const toggleShortlist = (candidate: CandidateProfile) => {
    setShortlist(prev => {
      const exists = prev.find(c => c.id === candidate.id);
      if (exists) {
        return prev.filter(c => c.id !== candidate.id);
      } else {
        return [...prev, candidate];
      }
    });
  };

  const resetApp = () => {
    setStep(AppStep.INPUT_JD);
    setPersona(null);
    setCandidates([]);
    setShortlist([]);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={resetApp}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Bot className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
              TalentScout AI
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-2 text-sm text-slate-500">
             <span className={`${step === AppStep.INPUT_JD ? 'text-blue-600 font-semibold' : ''}`}>1. Job Description</span>
             <ChevronRight className="w-4 h-4" />
             <span className={`${step === AppStep.REVIEW_PERSONA ? 'text-blue-600 font-semibold' : ''}`}>2. Persona</span>
             <ChevronRight className="w-4 h-4" />
             <span className={`${step === AppStep.SEARCHING || step === AppStep.RESULTS ? 'text-blue-600 font-semibold' : ''}`}>3. Sourcing</span>
          </div>

          <div className="flex items-center">
            <UserCircle className="w-8 h-8 text-slate-300" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="text-sm font-bold hover:underline">Dismiss</button>
            </div>
        )}

        {step === AppStep.INPUT_JD && (
          <JobInput onAnalyze={handleAnalyzeJD} isLoading={loading} />
        )}

        {step === AppStep.REVIEW_PERSONA && persona && (
          <PersonaReview initialPersona={persona} onConfirm={handleConfirmPersona} />
        )}

        {step === AppStep.SEARCHING && (
          <AgentStatus />
        )}

        {step === AppStep.RESULTS && (
          <CandidateList 
            candidates={candidates} 
            shortlist={shortlist}
            onToggleShortlist={toggleShortlist}
            onReset={resetApp} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} TalentScout AI. Powered by Gemini 3.
        </div>
      </footer>
    </div>
  );
};

export default App;