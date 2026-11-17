import React, { useState } from 'react';
import { X, Clock, Video, MessageSquare, Check } from 'lucide-react';
import type { DecrypteSession, ContentType, HugoUser } from '../types/ddd';
import { CONTENT_TYPE_LABELS } from '../constants/hugoData';

interface LogEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: number;
  user: HugoUser | null;
  onAddSession: (session: DecrypteSession) => void;
}

export const LogEntryModal: React.FC<LogEntryModalProps> = ({
  isOpen,
  onClose,
  selectedDay,
  user,
  onAddSession,
}) => {
  if (!isOpen) return null;

  const now = new Date();
  const defaultTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const [time, setTime] = useState(defaultTime);
  const [contentType, setContentType] = useState<ContentType>('actus-du-jour');
  const [videoTitle, setVideoTitle] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Connexion Google requise pour enregistrer une session.");
      return;
    }

    const newSession: DecrypteSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.uid,
      userName: user.displayName,
      userPhoto: user.photoURL,
      dayNumber: selectedDay,
      dateString: `2026-12-${selectedDay.toString().padStart(2, '0')}`,
      timestamp: time,
      contentType,
      videoTitle: videoTitle.trim() || undefined,
      comment: comment.trim() || undefined,
      mentalSaturation: 1,
      createdAt: Date.now(),
    };

    onAddSession(newSession);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-black text-white">
              Enregistrer une dose Hugo Décrypte
            </h3>
            <p className="text-xs text-slate-400">
              Jour : {selectedDay} Décembre (Objectif : {selectedDay} fois)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 mt-4 text-xs">
          
          {/* Heure */}
          <div>
            <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Heure</span>
              <span className="text-red-400">*</span>
            </label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Type de format (facultatif) */}
          <div>
            <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-indigo-400" />
              <span>Format (facultatif)</span>
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value as ContentType)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
            >
              {(Object.keys(CONTENT_TYPE_LABELS) as ContentType[]).map((type) => (
                <option key={type} value={type}>
                  {CONTENT_TYPE_LABELS[type].label}
                </option>
              ))}
            </select>
          </div>

          {/* Contenu / Vidéo (facultatif) */}
          <div>
            <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Contenu ou Titre de la vidéo</span>
              <span className="text-[10px] text-slate-500 lowercase">facultatif</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Les Actus du Jour, Interview, etc."
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Commentaire (facultatif) */}
          <div>
            <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>Commentaire</span>
              </span>
              <span className="text-[10px] text-slate-500 lowercase">facultatif</span>
            </label>
            <textarea
              rows={2}
              placeholder="Commentaire ou ressenti..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Valider</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
