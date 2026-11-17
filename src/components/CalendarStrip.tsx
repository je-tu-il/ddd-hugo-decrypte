import React from 'react';
import { Calendar, Lock, CheckCircle2 } from 'lucide-react';

interface CalendarStripProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
  countByDay: Record<number, number>;
  maxDays: number;
  isBeforeDecember: boolean;
  currentDayInDecember: number | null; // 1..31 if currently in December, else null
}

export const CalendarStrip: React.FC<CalendarStripProps> = ({
  selectedDay,
  onSelectDay,
  countByDay,
  maxDays,
  isBeforeDecember,
  currentDayInDecember,
}) => {
  const daysArray = Array.from({ length: maxDays }, (_, i) => i + 1);

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Calendrier du DDD (1er au 31 Décembre)
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">
          {isBeforeDecember
            ? '🔒 Défi verrouillé jusqu\'au 1er décembre'
            : `Aujourd'hui : ${currentDayInDecember} décembre`}
        </span>
      </div>

      {/* Grid of 31 days */}
      <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-10 lg:grid-cols-11 gap-2">
        {daysArray.map((day) => {
          const count = countByDay[day] || 0;
          const target = day;
          const isCompleted = count >= target;
          const isSelected = selectedDay === day;

          // Day is locked if we are before December or if in December and day > currentDayInDecember
          const isLocked = isBeforeDecember || (currentDayInDecember !== null && day > currentDayInDecember);

          return (
            <button
              key={day}
              onClick={() => onSelectDay(day)}
              className={`relative flex flex-col items-center justify-between p-2 rounded-xl border text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600/30 border-blue-500 shadow-md ring-1 ring-blue-500'
                  : isLocked
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-60 hover:opacity-100'
                  : isCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="w-full flex items-center justify-between text-[11px] font-bold">
                <span className={isSelected ? 'text-blue-400' : 'text-slate-300'}>
                  {day}
                </span>
                {isLocked ? (
                  <Lock className="w-3 h-3 text-slate-400" />
                ) : isCompleted ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <span className="text-[9px] text-slate-400">/{target}</span>
                )}
              </div>

              <div className="my-1">
                <span className="text-xs font-black text-white">
                  {count}
                </span>
              </div>

              <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isCompleted ? 'bg-emerald-500' : count > 0 ? 'bg-blue-500' : 'bg-transparent'
                  }`}
                  style={{ width: `${Math.min(100, (count / target) * 100)}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
