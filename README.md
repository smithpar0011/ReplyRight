# ReplyRight 🚀

AI-powered automated Google review responses for local businesses.

## Deploy in 10 Minutes

### Step 1 — Get your Anthropic API Key
1. Go to https://console.anthropic.com/
2. Sign up / log in
3. Click "API Keys" → "Create Key"
4. Copy the key (starts with `sk-ant-...`)

### Step 2 — Push to GitHub
1. Go to https://github.com and create a free account
2. Click "New Repository" → name it `replyright` → click "Create"
3. Download GitHub Desktop: https://desktop.github.com/
4. Open GitHub Desktop → "Add Existing Repository" → select this folder
5. Click "Publish Repository"

### Step 3 — Deploy to Vercel (Free)
1. Go to https://vercel.com and sign up with your GitHub account
2. Click "Add New Project"
3. Select your `replyright` repository → click "Import"
4. Before clicking Deploy, click "Environment Variables"
5. Add: `ANTHROPIC_API_KEY` = your key from Step 1
6. Click "Deploy" 🎉

Your site will be live at `replyright.vercel.app` in ~2 minutes!

### Step 4 — Custom Domain (Optional, ~$12/year)
1. Buy `replyright.com` (or similar) at https://namecheap.com
2. In Vercel → your project → "Domains" → add your domain
3. Follow the DNS instructions

## Local Development
\`\`\`bash
npm install
cp .env.example .env.local
# Add your API key to .env.local
npm run dev
\`\`\`
Open http://localhost:3000

## Tech Stack
- Next.js 14 (React framework)
- Anthropic Claude API (AI responses)
- Vercel (free hosting)
