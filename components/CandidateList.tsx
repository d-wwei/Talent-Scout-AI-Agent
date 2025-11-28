import React, { useState } from 'react';
import { CandidateProfile } from '../types';
import { ExternalLink, MapPin, Briefcase, Star, AlertCircle, RefreshCw, Inbox, Layers } from 'lucide-react';

interface CandidateListProps {
  candidates: CandidateProfile[];
  shortlist: CandidateProfile[];
  onToggleShortlist: (candidate: CandidateProfile) => void;
  onReset: () => void;
}

export const CandidateList: React.FC<CandidateListProps> = ({ candidates, shortlist, onToggleShortlist, onReset }) => {
  const [view, setView] = useState<'all' | 'shortlist'>('all');

  const displayedCandidates = view === 'all' ? candidates : shortlist;

  const isShortlisted = (id: string) => shortlist.some(c => c.id === id);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Candidates</h2>
          <p className="text-slate-500">Review generated matches and manage your shortlist.</p>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>New Search</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-8 border-b border-slate-200">
        <button 
          onClick={() => setView('all')}
          className={`flex items-center space-x-2 pb-3 px-1 border-b-2 transition-colors ${
            view === 'all' 
              ? 'border-blue-600 text-blue-600 font-medium' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Matches ({candidates.length})</span>
        </button>
        <button 
          onClick={() => setView('shortlist')}
          className={`flex items-center space-x-2 pb-3 px-1 border-b-2 transition-colors ${
            view === 'shortlist' 
              ? 'border-blue-600 text-blue-600 font-medium' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Shortlist ({shortlist.length})</span>
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6 min-h-[400px]">
        {displayedCandidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
             {view === 'shortlist' ? (
                <>
                  <div className="bg-slate-50 p-4 rounded-full mb-4">
                     <Star className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900">Your shortlist is empty</h3>
                  <p className="text-slate-500 max-w-sm mt-2">Star candidates from the "All Matches" tab to save them here for later review.</p>
                  <button onClick={() => setView('all')} className="mt-6 text-blue-600 font-medium hover:underline">
                    Browse Matches
                  </button>
                </>
             ) : (
                <p className="text-slate-500">No candidates found.</p>
             )}
          </div>
        ) : (
          displayedCandidates.map((candidate) => {
            const shortlisted = isShortlisted(candidate.id);
            return (
              <div key={candidate.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow animate-fade-in-up">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  
                  {/* Profile Main */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{candidate.name}</h3>
                        <p className="text-blue-600 font-medium">{candidate.headline}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        candidate.matchScore >= 90 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        candidate.matchScore >= 75 ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {candidate.matchScore}% Match
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-slate-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{candidate.currentCompany}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{candidate.location}</span>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {candidate.summary}
                    </p>

                    {/* Skills */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Matched Skills</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {candidate.matchingSkills.map((skill, i) => (
                            <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded border border-emerald-100 font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {candidate.missingSkills.length > 0 && (
                        <div>
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Missing / Not Mentioned</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {candidate.missingSkills.map((skill, i) => (
                              <span key={i} className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded border border-slate-200">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-3 md:w-48 flex-shrink-0 pt-2">
                    <a 
                      href={candidate.linkedInUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      <span>View on LinkedIn</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button 
                      onClick={() => onToggleShortlist(candidate)}
                      className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                        shortlisted 
                          ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' 
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${shortlisted ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                      <span>{shortlisted ? 'Shortlisted' : 'Shortlist'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {view === 'all' && candidates.length > 0 && (
        <div className="flex items-center justify-center p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
          <AlertCircle className="w-5 h-5 mr-2" />
          <p>
            <strong>Note:</strong> These profiles are simulated by Gemini AI. Clicking "View on LinkedIn" searches for real people matching these criteria.
          </p>
        </div>
      )}
    </div>
  );
};