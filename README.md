# ChatGPT GitHub Agent

Assistant de développement hébergé sur Vercel, connecté à GitHub et à l'API OpenAI.

## Fonctions

- Connexion GitHub OAuth
- Sélection des repositories accessibles
- Sélection de branche
- Création de branche `ai/...`
- Lecture du dépôt par l'agent
- Analyse d'une demande en langage naturel
- Proposition de modifications multi-fichiers
- Aperçu des fichiers avant application
- Écriture/commit sur GitHub
- UI sombre responsive

## Variables Vercel

```env
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5.6-luna
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GITHUB_CALLBACK_URL=https://TON-DOMAINE.vercel.app/api/auth/github/callback
SESSION_SECRET=une-longue-valeur-aleatoire
```

## GitHub OAuth

Dans GitHub : Settings → Developer settings → OAuth Apps → New OAuth App.

Homepage URL : ton URL Vercel.

Authorization callback URL : `https://TON-DOMAINE.vercel.app/api/auth/github/callback`.

Copie ensuite le Client ID et le Client Secret dans les variables Vercel. Le secret ne doit jamais être mis dans le dépôt.

## OpenAI

Crée une clé API dans le tableau de bord OpenAI et ajoute-la uniquement comme variable serveur `OPENAI_API_KEY` dans Vercel.

## Développement local

```bash
npm install
npm run dev
```

Pour le local, utilise un callback `http://localhost:3000/api/auth/github/callback`.

## Sécurité

Le token GitHub est stocké dans un cookie HTTP-only chiffré côté serveur. Les clés OpenAI et GitHub OAuth restent côté serveur. L'agent interdit les fichiers secrets, `.env`, `.git`, `node_modules` et `.next`.
