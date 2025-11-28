import React, { useState, useEffect } from 'react';
import { CandidatePersona } from '../types';
import { UserCheck, Edit2, Search, MapPin, Award, CheckCircle2, ExternalLink } from 'lucide-react';

interface PersonaReviewProps {
  initialPersona: CandidatePersona;
  onConfirm: (persona: CandidatePersona) => void;
}

export const PersonaReview: React.FC<PersonaReviewProps> = ({ initialPersona, onConfirm }) => {
  const [persona, setPersona] = useState<CandidatePersona>(initialPersona);

  // Update local state if prop changes (though usually won't in this flow)
  useEffect(() => {
    setPersona(initialPersona);
  }, [initialPersona]);

  const handleConfirm = () => {
    onConfirm(persona);
  };

  const updateField = (field: keyof CandidatePersona, value: any) => {
    setPersona(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field: 'mustHaveSkills' | 'niceToHaveSkills' | 'keywords', index: number, value: string) => {
    const newArray = [...persona[field]];
    newArray[index] = value;
    setPersona(prev => ({ ...prev, [field]: newArray }));
  };

  const removeArrayItem = (field: 'mustHaveSkills' | 'niceToHaveSkills' | 'keywords', index: number) => {
    const newArray = [...persona[field]];
    newArray.splice(index, 1);
    setPersona(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: 'mustHaveSkills' | 'niceToHaveSkills' | 'keywords') => {
    setPersona(prev => ({ ...prev, [field]: [...prev[field], "New Item"] }));
  };

  const testLinkedInSearch = () => {
    // Construct a basic boolean search string
    // Use role title + (keywords OR joined)
    const keywordsQuery = persona.keywords.length > 0 
      ? `(${persona.keywords.map(k => `"${k}"`).join(' OR ')})`
      : '';
    
    const baseQuery = `${persona.roleTitle} ${keywordsQuery}`;
    const url = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(baseQuery)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <UserCheck className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Step 2: Review Persona</h2>
              <p className="text-slate-500">The Agent extracted this profile. Adjust before sourcing.</p>
            </div>
          </div>
          <button
            onClick={handleConfirm}
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span>Confirm & Start Sourcing</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Info */}
          <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Job Title</label>
               <input 
                  type="text" 
                  value={persona.roleTitle} 
                  onChange={(e) => updateField('roleTitle', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
               />
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Seniority</label>
               <input 
                  type="text" 
                  value={persona.seniorityLevel} 
                  onChange={(e) => updateField('seniorityLevel', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
               />
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Experience</label>
               <input 
                  type="text" 
                  value={persona.yearsOfExperience} 
                  onChange={(e) => updateField('yearsOfExperience', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
               />
            </div>
          </div>

          {/* Location */}
          <div className="col-span-full md:col-span-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
             <div className="flex items-center space-x-2 mb-3">
                <MapPin className="w-4 h-4 text-slate-400" />
                <label className="text-sm font-bold text-slate-700">Location Strategy</label>
             </div>
             <input 
                  type="text" 
                  value={persona.locationPreference} 
                  onChange={(e) => updateField('locationPreference', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
             />
          </div>

           {/* Cultural Fit */}
           <div className="col-span-full md:col-span-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
             <div className="flex items-center space-x-2 mb-3">
                <Award className="w-4 h-4 text-slate-400" />
                <label className="text-sm font-bold text-slate-700">Cultural Alignment</label>
             </div>
             <input 
                  type="text" 
                  value={persona.culturalFit} 
                  onChange={(e) => updateField('culturalFit', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
             />
          </div>

          {/* Must Have Skills */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-bold text-slate-700 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span>Must-Have Skills</span>
              </label>
              <button onClick={() => addArrayItem('mustHaveSkills')} className="text-xs text-indigo-600 hover:underline">+ Add</button>
            </div>
            <div className="space-y-2">
              {persona.mustHaveSkills.map((skill, idx) => (
                <div key={idx} className="flex items-center space-x-2 group">
                   <input 
                    value={skill}
                    onChange={(e) => updateArrayField('mustHaveSkills', idx, e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-md px-2 py-1 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                   />
                   <button onClick={() => removeArrayItem('mustHaveSkills', idx)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Nice to Have Skills */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-bold text-slate-700 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span>Nice-to-Have Skills</span>
              </label>
              <button onClick={() => addArrayItem('niceToHaveSkills')} className="text-xs text-indigo-600 hover:underline">+ Add</button>
            </div>
            <div className="space-y-2">
              {persona.niceToHaveSkills.map((skill, idx) => (
                <div key={idx} className="flex items-center space-x-2 group">
                   <input 
                    value={skill}
                    onChange={(e) => updateArrayField('niceToHaveSkills', idx, e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-md px-2 py-1 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                   />
                   <button onClick={() => removeArrayItem('niceToHaveSkills', idx)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div className="col-span-full bg-slate-800 p-5 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Boolean Search Keywords</span>
              </label>
              <div className="flex space-x-4">
                <button onClick={testLinkedInSearch} className="flex items-center space-x-1 text-xs text-blue-300 hover:text-blue-100 hover:underline transition-colors">
                    <ExternalLink className="w-3 h-3" />
                    <span>Test Search on LinkedIn</span>
                </button>
                <button onClick={() => addArrayItem('keywords')} className="text-xs text-blue-300 hover:underline">+ Add</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {persona.keywords.map((keyword, idx) => (
                <div key={idx} className="flex items-center bg-slate-700 rounded-md px-3 py-1.5 border border-slate-600">
                   <input 
                    value={keyword}
                    onChange={(e) => updateArrayField('keywords', idx, e.target.value)}
                    className="bg-transparent text-sm text-slate-200 focus:outline-none w-auto min-w-[60px]"
                   />
                   <button onClick={() => removeArrayItem('keywords', idx)} className="ml-2 text-slate-500 hover:text-red-400">×</button>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400">These keywords will be used to construct the search query on external platforms.</p>
          </div>

        </div>
      </div>
    </div>
  );
};