import React, { useState, useEffect } from 'react';
import { HUGO_QUOTES } from '../constants/hugoData';
import { Sparkles, RefreshCw } from 'lucide-react';

export const HugoQuoteBanner: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % HUGO_QUOTES.length);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const nextQuote = () => {
    setIndex((prev) => (prev + 1) % HUGO_QUOTES.length);
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-cyan-950/40 border-y border-blue-500/10 px-4 py-2.5 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-blue-300 overflow-hidden">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-spin-slow" />
          <span className="font-semibold text-cyan-400 shrink-0">Hugo dit :</span>
          <p className="truncate italic text-slate-300 font-medium">
            « {HUGO_QUOTES[index]} »
          </p>
        </div>
        <button
          onClick={nextQuote}
          className="text-slate-400 hover:text-cyan-300 transition-colors shrink-0 p-1 rounded-lg hover:bg-slate-800"
          title="Autre citation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
