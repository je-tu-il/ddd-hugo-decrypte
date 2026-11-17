import React from 'react';
import type { DecrypteSession } from '../types/ddd';
import { CONTENT_TYPE_LABELS } from '../constants/hugoData';
import { Clock, MessageSquare, Trash2, ListFilter } from 'lucide-react';

interface SessionListProps {
  sessions: DecrypteSession[];
  selectedDay: number;
  onDeleteSession: (id: string) => void;
}

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  selectedDay,
  onDeleteSession,
}) => {
  const daySessions = sessions.filter((s) => s.dayNumber === selectedDay);

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ListFilter className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Historique du {selectedDay} Décembre ({daySessions.length})
          </h3>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {daySessions.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            Aucune session enregistrée pour ce jour.
          </div>
        ) : (
          daySessions.map((session, index) => {
            const formatMeta = CONTENT_TYPE_LABELS[session.contentType] || CONTENT_TYPE_LABELS['actus-du-jour'];

            return (
              <div
                key={session.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-[11px] text-slate-300">
                    #{daySessions.length - index}
                  </span>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1 font-mono text-cyan-300">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {session.timestamp}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${formatMeta.badgeColor}`}>
                        {formatMeta.label}
                      </span>
                    </div>

                    {session.videoTitle && (
                      <div className="font-semibold text-white mt-0.5">
                        {session.videoTitle}
                      </div>
                    )}

                    {session.comment && (
                      <p className="text-slate-400 mt-0.5 italic flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 shrink-0 text-slate-500" />
                        <span>« {session.comment} »</span>
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onDeleteSession(session.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
