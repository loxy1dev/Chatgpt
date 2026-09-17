# My AI V2

Interface de chat IA pour Vercel.

## Installation

npm install

Créer `.env.local` :

OPENAI_API_KEY=ta_cle_api
OPENAI_MODEL=gpt-5.6-luna

Lancer :

npm run dev

Puis ouvrir http://localhost:3000

## Vercel

Importer le dépôt GitHub dans Vercel puis ajouter `OPENAI_API_KEY` et `OPENAI_MODEL` dans Environment Variables.

Ne jamais publier `OPENAI_API_KEY` sur GitHub.
