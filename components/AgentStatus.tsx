import React, { useEffect, useState } from 'react';
import { Loader2, Linkedin, CheckCircle, Search } from 'lucide-react';

export const AgentStatus: React.FC = () => {
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const messages = [
      "Initializing search agent...",
      "Connecting to knowledge base...",
      "Applying boolean search strings...",
      "Scanning professional networks (simulated)...",
      "Filtering for 'Senior' level candidates...",
      "Analyzing skill matches...",
      "Removing duplicates...",
      "Ranking candidates by relevance...",
      "Finalizing list..."
    ];

    let delay = 0;
    messages.forEach((msg, index) => {
      delay += Math.random() * 800 + 400; // Random delay between 400ms and 1200ms
      setTimeout(() => {
        setLog(prev => [...prev, msg]);
      }, delay);
    });
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mt-12">
      <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-800 overflow-hidden relative">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="flex flex-col items-center justify-center space-y-6 z-10 relative">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
            <div className="bg-slate-800 p-4 rounded-full border border-slate-700 relative z-10">
              <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
            </div>
          </div>
          
          <h3 className="text-xl font-medium text-white">AI Agent is sourcing...</h3>
          
          <div className="w-full bg-slate-950/50 rounded-lg p-4 h-48 overflow-y-auto font-mono text-sm border border-slate-800/50 custom-scrollbar">
            {log.map((line, i) => (
              <div key={i} className="flex items-center space-x-3 mb-2 animate-fade-in-up">
                {i === log.length - 1 ? (
                  <Loader2 className="w-3 h-3 text-blue-500 animate-spin flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                )}
                <span className={i === log.length - 1 ? "text-blue-200" : "text-slate-400"}>
                  {line}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};