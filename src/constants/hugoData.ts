import type { ContentType } from '../types/ddd';

export const HUGO_QUOTES = [
  "Prenez soin de vous et de vos proches.",
  "Bref, je ne sais pas ce que vous en pensez, dites-le moi dans les commentaires !",
  "Voici les 5 actualités en bref qu'il ne fallait pas manquer aujourd'hui.",
  "On commence tout de suite avec le sujet à la une.",
  "C'est une information majeure tombée il y a quelques minutes.",
  "Bienvenue dans ce nouveau format des Actus du Jour.",
  "Pour ne rien rater des prochains décryptages, pensez à vous abonner et à activer la cloche.",
  "Prenez 10 minutes par jour pour comprendre le monde qui nous entoure.",
  "Un grand merci à toute l'équipe de rédaction et de montage qui a charbonné aujourd'hui.",
  "Restez curieux, restez informés, et on se retrouve demain pour une nouvelle dose d'actu."
];

export const CONTENT_TYPE_LABELS: Record<ContentType, { label: string; badgeColor: string }> = {
  'actus-du-jour': { label: 'Actus du Jour', badgeColor: 'bg-blue-600/30 text-blue-400 border-blue-500/30' },
  'format-long': { label: 'Grand Format / Enquête', badgeColor: 'bg-indigo-600/30 text-indigo-400 border-indigo-500/30' },
  'interview': { label: 'Interview Face Cachée', badgeColor: 'bg-purple-600/30 text-purple-400 border-purple-500/30' },
  'short-flash': { label: 'Short / Flash Actu', badgeColor: 'bg-amber-600/30 text-amber-400 border-amber-500/30' },
  'podcast-elucid': { label: 'Podcast / Débat', badgeColor: 'bg-emerald-600/30 text-emerald-400 border-emerald-500/30' },
  'mashup': { label: 'Rediffusion / Replay', badgeColor: 'bg-cyan-600/30 text-cyan-400 border-cyan-500/30' },
  'autre': { label: 'Autre source Hugo', badgeColor: 'bg-slate-600/30 text-slate-400 border-slate-500/30' },
};

export const RANKS = [
  { minTotal: 0, title: "Observateur Curieux", icon: "🌱", color: "text-slate-400" },
  { minTotal: 10, title: "Stagiaire Flash Actu", icon: "📰", color: "text-blue-400" },
  { minTotal: 30, title: "Monteur de l'Extrême", icon: "⚡", color: "text-cyan-400" },
  { minTotal: 75, title: "Journaliste Tout-Terrain", icon: "🎙️", color: "text-emerald-400" },
  { minTotal: 150, title: "Rédacteur en Chef DDD", icon: "🎖️", color: "text-amber-400" },
  { minTotal: 250, title: "Ultra Décrypteur Confirmé", icon: "🔥", color: "text-orange-500" },
  { minTotal: 380, title: "L'Ombre d'Hugo Travers", icon: "👑", color: "text-purple-400" },
  { minTotal: 496, title: "Légende Vivante du DDD (31/31)", icon: "🏆", color: "text-yellow-300" },
];

export function getRankForCount(totalCount: number) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (totalCount >= RANKS[i].minTotal) {
      return RANKS[i];
    }
  }
  return RANKS[0];
}

// Calculate the total required for a range (e.g. 1..31 = 496)
export function calculateTotalGoal(maxDays: number = 31): number {
  return (maxDays * (maxDays + 1)) / 2;
}
