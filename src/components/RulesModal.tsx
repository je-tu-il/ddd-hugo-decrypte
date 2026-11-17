import React from 'react';
import { X, BookOpen, Flame, CheckCircle2, ShieldAlert, Award } from 'lucide-react';
import { RANKS } from '../constants/hugoData';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl text-left max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">
                Le Règlement Officiel du DDD
              </h3>
              <p className="text-xs text-slate-400">
                Décembre Décrypte Défi (Hugo Edition)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-6 text-xs text-slate-300 leading-relaxed">
          
          {/* 1. La règle d'or */}
          <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30">
            <h4 className="text-sm font-bold text-blue-300 flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-blue-400" />
              <span>1. La Règle d'Or Arithmétique</span>
            </h4>
            <p>
              Chaque jour de décembre, vous devez consommer et valider un nombre de contenus Hugo Décrypte égal à la date du jour :
            </p>
            <ul className="mt-2 space-y-1 font-mono text-cyan-300 text-[11px] list-disc list-inside">
              <li>1er décembre : 1 Hugo Décrypte</li>
              <li>2 décembre : 2 Hugo Décrypte</li>
              <li>...</li>
              <li>15 décembre : 15 Hugo Décrypte</li>
              <li>24 décembre (Finale) : 24 Hugo Décrypte</li>
            </ul>
            <p className="mt-2 text-[11px] text-slate-400 font-sans">
              Total cumulé le 24 décembre au soir : <strong className="text-white font-bold">300 décryptages !</strong>
            </p>
          </div>

          {/* 2. Formats éligibles */}
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>2. Formats et Contenus Autorisés</span>
            </h4>
            <p className="mb-2">
              Tout contenu produit par l'écosystème <strong>HugoDécrypte</strong> est valable :
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-semibold text-slate-200">
                ✅ Les Actus du Jour (YouTube)
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-semibold text-slate-200">
                ✅ Interviews "Face Cachée"
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-semibold text-slate-200">
                ✅ Grands Formats / Enquêtes
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-semibold text-slate-200">
                ✅ Shorts / Flash Infos TikTok / Insta
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-semibold text-slate-200">
                ✅ Podcasts & Débats
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-semibold text-slate-200">
                ✅ Rediffusions & Replays
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              Astuce pour les jours à haute intensité (à partir du 18 décembre) : la vitesse de lecture x1.25 ou x1.5 et les Shorts sont légaux dans les règles !
            </p>
          </div>

          {/* 3. Les Grades */}
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-yellow-400" />
              <span>3. Les Rangs et Titres Honorifiques</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {RANKS.map((r) => (
                <div key={r.title} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-xl">{r.icon}</div>
                  <div className="text-[10px] font-bold text-white mt-1 truncate">{r.title}</div>
                  <div className="text-[9px] text-slate-400 font-mono">{r.minTotal}+ actus</div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Santé & Fair-Play */}
          <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300">Avertissement Santé Mentale :</strong> Si votre cerveau commence à entendre la voix d'Hugo dans vos rêves disant « Bref, prenez soin de vous », faites une pause de 10 minutes et buvez un verre d'eau !
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            J'ai compris, je commence le défi !
          </button>
        </div>

      </div>
    </div>
  );
};
