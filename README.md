# ⚡ DDD — Décembre Décrypte Défi (Hugo Edition)

Bienvenue sur le projet officiel du **DDD (Décembre Décrypte Défi)** avec **Hugo Décrypte** !

---

## 🎯 Le Concept & La Règle d'Or
Chaque jour de décembre, consommez et validez un nombre de contenus Hugo Décrypte égal à la date du jour :
- **1er décembre** : 1 Hugo Décrypte
- **2 décembre** : 2 Hugo Décrypte
- ...
- **31 décembre (Finale)** : 31 Hugo Décrypte
- 🏁 **Total cumulé le 31 au soir : 496 doses d'actualité !**

---

## ✨ Fonctionnalités Incluses

1. **🔐 Connexion Google Obligatoire & Synchro Cloud**
   - Écran de verrouillage exigeant la connexion Google (Firebase Auth).
   - Mode Local avec profil Google fonctionnel immédiatement sans configuration obligatoire.
   - Modal de configuration Firebase intégré pour connecter votre base Firestore temps réel entre amis (PC, tablettes et smartphones).

2. **🔒 Verrouillage Novembre**
   - En novembre, le défi est strictement verrouillé avec un compte à rebours jusqu'au 1er décembre.

3. **📊 Jauge de Réussite & Calendrier des 31 Jours**
   - Jauge circulaire animée en SVG avec progression en temps réel pour le jour sélectionné.
   - Déclenchement automatique de pluie de confettis (`canvas-confetti`) dès que l'objectif du jour est validé à 100%.
   - Barre de progression globale du marathon de décembre (sur 496 vidéos).
   - Calendrier interactif du 1er au 31 décembre pour naviguer et consulter l'historique de chaque jour.

4. **📝 Saisie Unique d'une Dose "Hugo Décrypté"**
   - Un seul bouton d'action clair dans l'interface.
   - Heure de visionnage (auto-complétée).
   - Type de format : *Actus du Jour, Grand Format / Enquête, Face Cachée, Short / Flash Actu, Podcast...*
   - Sujet ou Titre de la vidéo (facultatif).
   - Commentaire / Réaction personnelle (facultatif).

5. **⏱️ Rappels & Calculateur de Cadence Intelligent**
   - Analyse automatique du temps restant avant minuit et du nombre de vidéos à valider.
   - Diagnostic en direct :
     - 🟢 *Rythme Tranquille* : ex. 1 vidéo toutes les 2h30.
     - 🟡 *Cadence Active* : ex. 1 vidéo toutes les 45 min.
     - 🚨 *Urgence Flash Actu* : ex. 1 vidéo toutes les 15 min en vitesse x1.5 !
   - Support des **Notifications Navigateur Web** (Notification API).
   - Jingle sonore Web Audio de rappel intégré.

6. **🏆 Classement Réel (Leaderboard)**
   - Classement sans faux bots : seuls les vrais utilisateurs connectés apparaissent.
   - Filtre par mois complet ou par jour sélectionné.
   - Bouton de partage de lien pour inviter des amis.

---

## 🚀 Démarrage Rapide

```bash
# Aller dans le dossier
cd E:\Reste\PROJET_PERSO\03_WEB_ET_JEUX\ddd-hugo-decrypte

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Compiler pour la production (Vercel ou WebEtu)
npm run build
```
