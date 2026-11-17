import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface SuccessGaugeProps {
  selectedDay: number;
  todayCount: number;
  totalCount: number;
  totalGoal: number;
  daysCompleted: number;
  maxDays: number;
  isLocked: boolean;
}

export const SuccessGauge: React.FC<SuccessGaugeProps> = ({
  selectedDay,
  todayCount,
  totalCount,
  totalGoal,
  daysCompleted,
  maxDays,
  isLocked,
}) => {
  const targetCount = selectedDay;
  const progressRatio = Math.min(1, todayCount / targetCount);
  const percentage = Math.round(progressRatio * 100);
  const isDayCompleted = todayCount >= targetCount;
  const globalPercentage = Math.min(100, Math.round((totalCount / totalGoal) * 100));

  useEffect(() => {
    if (isDayCompleted && todayCount === targetCount && todayCount > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isDayCompleted, todayCount, targetCount]);

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Jauge du jour sélectionné */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 backdrop-blur-md flex flex-col items-center justify-between shadow-lg">
        <div className="w-full flex items-center justify-between mb-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Jauge du Jour
            </span>
            <h2 className="text-lg font-black text-white">
              {selectedDay} Décembre
            </h2>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
            Objectif : {targetCount} fois
          </span>
        </div>

        <div className="relative flex items-center justify-center my-3">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#1e293b"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={isDayCompleted ? '#10b981' : '#3b82f6'}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500 ease-out"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black text-white">
              {todayCount}
              <span className="text-base font-normal text-slate-400">/{targetCount}</span>
            </span>
            <span className={`text-xs font-bold ${isDayCompleted ? 'text-emerald-400' : 'text-blue-400'}`}>
              {percentage}%
            </span>
          </div>
        </div>

        <div className="w-full text-center text-xs">
          {isLocked ? (
            <span className="text-amber-400 font-medium">
              🔒 Verrouillé jusqu'à cette date
            </span>
          ) : isDayCompleted ? (
            <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Objectif du jour accompli !
            </span>
          ) : (
            <span className="text-slate-400 flex items-center justify-center gap-1">
              <AlertCircle className="w-4 h-4 text-blue-400" />
              Il vous reste {targetCount - todayCount} visionnage(s) aujourd'hui
            </span>
          )}
        </div>
      </div>

      {/* 2. Jauge Globale du DDD (Total 496) */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 backdrop-blur-md flex flex-col justify-between shadow-lg">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Progression Totale (1 au 31 Décembre)
          </span>
          <h2 className="text-lg font-black text-white mt-0.5">
            Le Défi des 31 Jours
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Total à atteindre sur tout le mois : <strong className="text-white">{totalGoal} visionnages</strong>.
          </p>

          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300">Total cumulé</span>
              <span className="text-blue-400 font-bold">
                {totalCount} / {totalGoal} ({globalPercentage}%)
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500"
                style={{ width: `${Math.max(2, globalPercentage)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-center">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Jours 100% validés</span>
            <span className="text-base font-black text-white">{daysCompleted} / {maxDays}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Restant</span>
            <span className="text-base font-black text-blue-400">{Math.max(0, totalGoal - totalCount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
