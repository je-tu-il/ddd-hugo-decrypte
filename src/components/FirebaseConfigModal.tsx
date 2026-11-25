import React, { useState } from 'react';
import { X, Key, Database, Globe, Check, Trash2, HelpCircle, Code } from 'lucide-react';
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
    projectId: 'ddd-hugo-decrypte',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  };

  const [form, setForm] = useState<FirebaseConfigParams>(current);
  const [snippetText, setSnippetText] = useState('');
  const [activeInputTab, setActiveInputTab] = useState<'snippet' | 'manual'>('snippet');

  // Parse snippet from Firebase Console (const firebaseConfig = { ... })
  const handleParseSnippet = (text: string) => {
    setSnippetText(text);
    try {
      const apiKeyMatch = text.match(/apiKey:\s*["']([^"']+)["']/);
      const authDomainMatch = text.match(/authDomain:\s*["']([^"']+)["']/);
      const projectIdMatch = text.match(/projectId:\s*["']([^"']+)["']/);
      const storageBucketMatch = text.match(/storageBucket:\s*["']([^"']+)["']/);
      const messagingSenderIdMatch = text.match(/messagingSenderId:\s*["']([^"']+)["']/);
      const appIdMatch = text.match(/appId:\s*["']([^"']+)["']/);

      if (apiKeyMatch && projectIdMatch) {
        setForm({
          apiKey: apiKeyMatch[1],
          authDomain: authDomainMatch ? authDomainMatch[1] : `${projectIdMatch[1]}.firebaseapp.com`,
          projectId: projectIdMatch[1],
          storageBucket: storageBucketMatch ? storageBucketMatch[1] : '',
          messagingSenderId: messagingSenderIdMatch ? messagingSenderIdMatch[1] : '',
          appId: appIdMatch ? appIdMatch[1] : '',
        });
      }
    } catch {
      // ignore
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.apiKey || !form.projectId) {
      alert('Veuillez au moins renseigner la clé API et le Project ID Firebase.');
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
              <span>Connexion Google Firebase</span>
            </span>
            <h3 className="text-xl font-black text-white tracking-tight">
              Configuration du projet
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isFirebaseConfigured
                ? '✅ Votre projet Firebase est actif et synchronisé.'
                : '⚠️ Configurez les clés Firebase pour activer la popup de connexion Google.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational tip */}
        <div className="my-4 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Où trouver ces clés ?</strong><br />
            Dans la <strong>Console Firebase</strong> ({'>'} Paramètres du projet {'>'} Vos applications Web), copiez l'objet <code className="text-cyan-300">firebaseConfig</code> et collez-le ci-dessous.
          </div>
        </div>

        {/* Input mode selection */}
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => setActiveInputTab('snippet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeInputTab === 'snippet'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Coller le code config</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveInputTab('manual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeInputTab === 'manual'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Champs manuels</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-3.5">
          {activeInputTab === 'snippet' ? (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Collez l'objet firebaseConfig ici :
              </label>
              <textarea
                rows={5}
                placeholder={`const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  authDomain: "ddd-hugo-decrypte.firebaseapp.com",\n  projectId: "ddd-hugo-decrypte",\n  ...\n};`}
                value={snippetText}
                onChange={(e) => handleParseSnippet(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
              {form.apiKey && (
                <p className="text-[11px] text-emerald-400 mt-1">
                  ✓ Clés détectées : Project ID <strong>{form.projectId}</strong>
                </p>
              )}
            </div>
          ) : (
            <>
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
                  placeholder="ddd-hugo-decrypte.firebaseapp.com"
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
                  placeholder="ddd-hugo-decrypte"
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
            </>
          )}

          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            {isFirebaseConfigured ? (
              <button
                type="button"
                onClick={clearFirebaseConfig}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-semibold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Réinitialiser</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Fermer
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Enregistrer & Activer</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
