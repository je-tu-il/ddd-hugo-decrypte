import React, { useState } from 'react';
import type { ParticipantScore } from '../types/ddd';
import { Trophy, Medal, Share2, Users } from 'lucide-react';

interface LeaderboardProps {
  participants: ParticipantScore[];
  selectedDay: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  participants,
  selectedDay,
}) => {
  const [filterMode, setFilterMode] = useState<'total' | 'today'>('total');
  const [copiedLink, setCopiedLink] = useState(false);

  // Sort real participants
  const sorted = [...participants].sort((a, b) => {
    if (filterMode === 'today') {
      return b.todayCount - a.todayCount;
    }
    return b.totalDecrypteCount - a.totalDecrypteCount;
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <h3 className="text-base font-black text-white">
              Classement DDD (Utilisateurs Réels)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Classement synchronisé entre les participants connectés avec Google.
          </p>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? 'Lien copié !' : 'Inviter un ami'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterMode('total')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterMode === 'total'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Total Mois (1 au 31 Décembre)
        </button>
        <button
          onClick={() => setFilterMode('today')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterMode === 'today'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Jour sélectionné ({selectedDay} Décembre)
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 backdrop-blur-md shadow-lg overflow-x-auto">
        {sorted.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center">
            <Users className="w-8 h-8 text-slate-600 mb-2" />
            <span>Aucun participant connecté pour le moment.</span>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-2.5 pl-2">Rang</th>
                <th className="pb-2.5">Participant</th>
                <th className="pb-2.5 text-center">{selectedDay} Décembre</th>
                <th className="pb-2.5 text-center">Total DDD</th>
                <th className="pb-2.5 text-right pr-2">Complétion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sorted.map((p, idx) => (
                <tr
                  key={p.userId}
                  className={`transition-colors ${
                    p.isCurrentUser ? 'bg-blue-600/15 font-semibold' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-3 pl-2 font-black text-sm">
                    {idx === 0 ? (
                      <span className="text-yellow-400 flex items-center gap-1">
                        <Medal className="w-4 h-4 fill-current" /> 1
                      </span>
                    ) : (
                      <span className="text-slate-400">#{idx + 1}</span>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={p.photoURL}
                        alt={p.displayName}
                        className="w-7 h-7 rounded-lg object-cover bg-slate-800 border border-slate-700"
                      />
                      <div>
                        <span className="font-bold text-white block">
                          {p.displayName} {p.isCurrentUser && '(Vous)'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <span className="font-bold text-white bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 text-xs">
                      {p.todayCount} / {selectedDay}
                    </span>
                  </td>
                  <td className="py-3 text-center font-black text-blue-400">
                    {p.totalDecrypteCount}
                  </td>
                  <td className="py-3 text-right pr-2 font-mono font-bold text-slate-300">
                    {p.completionPercentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {sorted.length <= 1 && (
          <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 text-center">
            💡 Invitez vos amis à se connecter avec leur compte Google pour apparaître ensemble dans le classement !
          </div>
        )}
      </div>
    </div>
  );
};
