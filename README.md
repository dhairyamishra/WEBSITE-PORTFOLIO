# dhairyamishra.github.io

Personal portfolio website — fully static, hosted on GitHub Pages.

**Live:** [dhairyamishra.github.io](https://dhairyamishra.github.io)

## Tech Stack

- **Framework:** [Astro 5](https://astro.build) (static output, zero JS by default)
- **Styling:** Tailwind CSS 3, custom dark neon design system
- **Components:** React Islands (contact form only)
- **Content:** Astro Content Collections (Markdown + Zod schemas)
- **Contact:** [Web3Forms](https://web3forms.com) (static form service)
- **Fonts:** Space Grotesk, Inter, JetBrains Mono
- **CI/CD:** GitHub Actions → GitHub Pages

## Local Development

```bash
cd apps/web
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Build

```bash
cd apps/web
npm run build    # outputs to apps/web/dist/
npm run preview  # preview the build locally
```

## Deployment

Automated via GitHub Actions — every push to `master` triggers a build and deploy to GitHub Pages.

Workflow: `.github/workflows/deploy.yml`

## Project Structure

```
├── apps/web/                  # Astro site
│   ├── src/
│   │   ├── components/        # Navigation, Footer, ContactForm
│   │   ├── content/
│   │   │   ├── projects/      # Project markdown files (8)
│   │   │   ├── experience/    # Experience markdown files (3)
│   │   │   └── config.ts      # Collection schemas
│   │   ├── layouts/           # Layout.astro
│   │   ├── pages/             # index, about, projects, contact
│   │   │   └── projects/[slug].astro
│   │   └── styles/            # global.css (neon design system)
│   ├── public/                # favicon, robots.txt
│   ├── astro.config.mjs
│   ├── tailwind.config.js
│   └── package.json
├── .github/workflows/         # CI/CD
│   └── deploy.yml
└── README.md
```

## Adding a Project

1. Create a new `.md` file in `apps/web/src/content/projects/`
2. Add frontmatter matching the schema in `config.ts` (title, description, date, tags, category, etc.)
3. Write the project body in Markdown
4. Set `featured: true` to show on the home page
5. Use the `liveUrl` field to link to external demos (Hugging Face, Railway, etc.)
6. Push to `master` — auto-deploys

## Setup Notes

- **Web3Forms:** Replace `YOUR_WEB3FORMS_ACCESS_KEY` in `ContactForm.tsx` with your key from [web3forms.com](https://web3forms.com)
- **GitHub Pages:** Repo must be named `dhairyamishra.github.io` and Pages source set to "GitHub Actions" in repo settings

## Contact

- **LinkedIn:** [dhairya-mishra](https://linkedin.com/in/dhairya-mishra/)
- **GitHub:** [dhairyamishra](https://github.com/dhairyamishra)
