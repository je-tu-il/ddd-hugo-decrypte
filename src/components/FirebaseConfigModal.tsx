import React, { useState } from 'react';
import { X, Key, Database, Globe, Check, Trash2, HelpCircle } from 'lucide-react';
import { 
  getSavedFirebaseConfig, 
  saveFirebaseConfig, 
  clearFirebaseConfig, 
  isFirebaseConfigured,
  type FirebaseConfigParams 
} from '../services/firebase';

interface FirebaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseConfigModal: React.FC<FirebaseConfigModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const current = getSavedFirebaseConfig() || {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  };

  const [form, setForm] = useState<FirebaseConfigParams>(current);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.apiKey || !form.projectId) {
      alert('Veuillez au moins renseigner la clé API et le Project ID.');
      return;
    }
    saveFirebaseConfig(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl text-left max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>Synchronisation Cloud Firebase</span>
            </span>
            <h3 className="text-xl font-black text-white tracking-tight">
              Paramètres Google & Firestore
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isFirebaseConfigured
                ? '✅ Firebase Cloud est actuellement connecté.'
                : '⚡ Mode Démo local actif. Connectez votre projet Firebase pour la synchro multi-appareils.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational tip */}
        <div className="my-4 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Note :</strong> L'application fonctionne déjà immédiatement à 100% en mode local avec simulation Google et classement d'amis. Remplir ces clés permet la synchronisation en direct dans la base de données Firestore avec vos vrais amis sur mobile et PC.
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Key className="w-3 h-3 text-cyan-400" />
              <span>API Key</span>
            </label>
            <input
              type="text"
              placeholder="AIzaSy..."
              value={form.apiKey}
              onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-blue-400" />
              <span>Auth Domain</span>
            </label>
            <input
              type="text"
              placeholder="mon-projet-ddd.firebaseapp.com"
              value={form.authDomain}
              onChange={(e) => setForm({ ...form, authDomain: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Database className="w-3 h-3 text-indigo-400" />
              <span>Project ID</span>
            </label>
            <input
              type="text"
              placeholder="mon-projet-ddd"
              value={form.projectId}
              onChange={(e) => setForm({ ...form, projectId: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              App ID
            </label>
            <input
              type="text"
              placeholder="1:123456789:web:abcdef"
              value={form.appId}
              onChange={(e) => setForm({ ...form, appId: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            {isFirebaseConfigured ? (
              <button
                type="button"
                onClick={clearFirebaseConfig}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Réinitialiser</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Fermer
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Enregistrer & Recharger</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
