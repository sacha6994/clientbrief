# ClientBrief

> Collecte de contenu client simplifiée pour créateurs de sites web.

Générez un lien unique → votre client remplit un wizard guidé → vous recevez un JSON structuré prêt à injecter dans vos templates Next.js.

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** (styling)
- **Claude API** (génération de textes IA)
- **Stockage JSON local** (upgrade vers Supabase possible)

## Installation rapide

```bash
# Cloner le repo
git clone https://github.com/TON_USERNAME/clientbrief.git
cd clientbrief

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec ta clé ANTHROPIC_API_KEY

# Lancer en dev
npm run dev
```

## Variables d'environnement

| Variable | Description | Requis |
|---|---|---|
| `ANTHROPIC_API_KEY` | Clé API Anthropic pour la génération IA | Oui |
| `NEXT_PUBLIC_APP_URL` | URL de l'app (pour les liens briefs) | Non |

> Les variables Supabase sont optionnelles — par défaut, l'app utilise un stockage JSON dans `.data/briefs.json`.

## Fonctionnalités

- ✅ Dashboard avec stats et gestion des briefs
- ✅ Wizard client en 8 étapes guidées
- ✅ Collecte : infos entreprise, identité visuelle, textes, services, photos, réseaux sociaux
- ✅ Génération de textes IA (hero, about, CTA) via Claude
- ✅ Export JSON structuré, prêt pour vos templates
- ✅ Liens uniques par client (token nanoid)
- ✅ Status tracking (pending / in_progress / completed)

## Déploiement Vercel

```bash
# Via CLI
vercel

# Ou push sur GitHub → import dans Vercel
```

⚠️ **Important** : Le stockage JSON local ne persiste PAS sur Vercel (filesystem éphémère). Pour la production, migre vers Supabase avec le SQL dans `supabase/migration.sql`.

## Migration Supabase (production)

1. Créer un projet Supabase
2. Exécuter `supabase/migration.sql`
3. Remplacer `src/lib/storage.ts` par des appels Supabase
4. Ajouter les env vars Supabase dans Vercel

## Licence

Projet privé — IRYA
