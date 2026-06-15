# Resume ATS Scanner

Upload your resume and paste a job description to instantly see how well you match. The app parses your PDF, sends it to Claude Haiku, and returns a score, matched/missing keywords, section breakdowns, and rewritten bullet suggestions — all in a few seconds.

**Stack:** Next.js 14 · TypeScript · Tailwind CSS · Claude Haiku (Anthropic) · unpdf

---

## Getting Started

**1. Clone and install**

```bash
git clone <your-repo-url>
cd resume-ats-scanner
npm install
```

**2. Add your Anthropic API key**

Create a `.env.local` file in the root:

```
ANTHROPIC_API_KEY=your_api_key_here
```

Get a key at [console.anthropic.com](https://console.anthropic.com).

**3. Run the dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploying to Vercel

```bash
npm install -g vercel
vercel
```

Set `ANTHROPIC_API_KEY` as an environment variable in your Vercel project settings.
