import React from 'react';
import type { HugoUser } from '../types/ddd';
import { LogIn, LogOut, Settings } from 'lucide-react';
import { isFirebaseConfigured } from '../services/firebase';

interface NavbarProps {
  user: HugoUser | null;
  onLogin: () => void;
  onLogout: () => void;
  onOpenFirebaseConfig: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogin,
  onLogout,
  onOpenFirebaseConfig,
}) => {
  return (
    <header className="w-full bg-slate-950 border-b border-slate-800 px-4 lg:px-8 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-base">
            DDD
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white m-0 p-0">
              DÉCEMBRE DÉCRYPTE DÉFI
            </h1>
            <p className="text-[11px] text-slate-400">
              Hugo Décrypte • 1er au 31 Décembre (Jour X = X fois)
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Firebase config button */}
          <button
            onClick={onOpenFirebaseConfig}
            className={`p-2 rounded-xl border text-xs font-medium transition-colors ${
              isFirebaseConfigured
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Configuration Firebase"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User profile / Login */}
          {user ? (
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-8 h-8 rounded-lg object-cover border border-slate-700 bg-slate-800"
              />
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-white max-w-[140px] truncate">
                  {user.displayName}
                </div>
                <div className="text-[10px] text-emerald-400">
                  Google Connecté
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Connexion Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
