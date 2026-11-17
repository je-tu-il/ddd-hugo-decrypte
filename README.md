# ⚡ DDD — Décembre Décrypte Défi (Hugo Edition)

Bienvenue sur le projet officiel du **DDD (Décembre Décrypte Défi)** avec **Hugo Décrypte** !

---

## 🎯 Le Concept & La Règle d'Or
Chaque jour de décembre, consommez et validez un nombre de contenus Hugo Décrypte égal à la date du jour :
- **1er décembre** : 1 Hugo Décrypte
- **2 décembre** : 2 Hugo Décrypte
- ...
- **24 décembre (Finale de l'Avent)** : 24 Hugo Décrypte
- 🏁 **Total cumulé le 24 au soir : 300 doses d'actualité !**

---

## ✨ Fonctionnalités Incluses

1. **🔐 Connexion Google & Synchro Cloud**
   - Connexion Google en 1 clic (Firebase Auth).
   - Mode Démo immédiat prêt à l'emploi sans configuration obligatoire.
   - Modal de configuration Firebase intégré pour connecter votre propre base Firestore temps réel entre amis (PC, tablettes et smartphones).

2. **📊 Jauge de Réussite & Calendrier de l'Avent**
   - Jauge circulaire animée en SVG avec progression en temps réel pour le jour sélectionné.
   - Déclenchement automatique de pluie de confettis (`canvas-confetti`) dès que l'objectif du jour est validé à 100%.
   - Barre de progression globale du marathon de décembre (sur 300 vidéos).
   - Compteur de série (Streak) en jours consécutifs.
   - Calendrier de l'Avent interactif du 1er au 24 décembre pour naviguer et consulter l'historique de chaque jour.

3. **📝 Saisie d'une Dose "Hugo Décrypté"**
   - Bouton d'action rapide `+ Je me suis Hugo Décrypté !`.
   - Heure de visionnage (auto-complétée).
   - Type de format : *Actus du Jour, Grand Format / Enquête, Face Cachée, Short / Flash Actu, Podcast...*
   - Sujet ou Titre de la vidéo (facultatif).
   - Commentaire / Réaction personnelle (facultatif).
   - Jauge d'état d'esprit et de saturation mentale (1 à 5).

4. **⏱️ Rappels & Calculateur de Cadence Intelligent**
   - Analyse automatique du temps restant avant minuit et du nombre de vidéos à valider.
   - Diagnostic en direct :
     - 🟢 *Rythme Tranquille* : ex. 1 vidéo toutes les 2h30.
     - 🟡 *Cadence Active* : ex. 1 vidéo toutes les 45 min.
     - 🚨 *Urgence Flash Actu* : ex. 1 vidéo toutes les 15 min en vitesse x1.5 !
   - Support des **Notifications Navigateur Web** (Notification API).
   - Jingle sonore Web Audio de rappel intégré.

5. **🏆 Classement & Compétition Amicale (Leaderboard)**
   - Podium Top 3 avec médailles d'or, d'argent et de bronze.
   - Classement général (total des vidéos) et classement journalier.
   - Système de partage d'invitation pour défier vos amis.
   - Grades honorifiques : *Stagiaire Flash Actu, Monteur de l'Extrême, Rédacteur en Chef DDD, L'Ombre d'Hugo Travers, Légende Vivante du DDD*.

---

## 🚀 Démarrage Rapide

```bash
# Aller dans le dossier
cd C:\Users\JulesR\.gemini\antigravity\scratch\ddd-hugo-decrypte

# Installer les dépendances (déjà fait)
npm install

# Lancer en développement
npm run dev

# Compiler pour la production
npm run build
```

L'application est accessible localement sur [http://localhost:5173/](http://localhost:5173/).
